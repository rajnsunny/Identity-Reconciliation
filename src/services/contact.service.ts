import { Op, InferCreationAttributes } from 'sequelize';
import db from '../models';

const findRelevantContacts = async (email?: string | null, phoneNumber?: string | null) => {
  return db.Contact.findAll({
    where: {
      [Op.or]: [
        { email: email || null },
        { phoneNumber: phoneNumber || null }
      ]
    },
    order: [['createdAt', 'ASC']],
  });
};

const createContact = async ({
  email,
  phoneNumber,
  linkedId = null,
  linkPrecedence = 'primary',
}: Partial<InferCreationAttributes<InstanceType<typeof db.Contact>>>) => {
  return db.Contact.create({
    email,
    phoneNumber,
    linkedId,
    linkPrecedence,
  });
};

const consolidateContacts = async (contacts: InstanceType<typeof db.Contact>[]) => {
  const primary = contacts.find((c) => c.linkPrecedence === 'primary') ?? contacts[0];

  const secondaryContacts = contacts.filter((c) => c.id !== primary.id);

  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryIds: number[] = [];

  for (const contact of [primary, ...secondaryContacts]) {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    if (contact.id !== primary.id) secondaryIds.push(contact.id);
  }

  return {
    primaryContatctId: primary.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: secondaryIds,
  };
};

const updateContactToSecondary = async (contact: InstanceType<typeof db.Contact>, newPrimaryId: number) => {
  contact.linkPrecedence = 'secondary';
  contact.linkedId = newPrimaryId;
  await contact.save();
};

const identifyContact = async (email?: string, phoneNumber?: string) => {
  const contacts = await findRelevantContacts(email, phoneNumber);

  if (contacts.length === 0) {
    const newContact = await createContact({
      email: email ?? null,
      phoneNumber: phoneNumber ?? null,
      linkPrecedence: 'primary',
    });
    return consolidateContacts([newContact]);
  }

  const existingEmails = contacts.map(c => c.email);
  const existingPhones = contacts.map(c => c.phoneNumber);

  const hasNewEmail = email && !existingEmails.includes(email);
  const hasNewPhone = phoneNumber && !existingPhones.includes(phoneNumber);

  if (hasNewEmail || hasNewPhone) {
    const primary = contacts.find(c => c.linkPrecedence === 'primary')!;
    await createContact({
      email,
      phoneNumber,
      linkPrecedence: 'secondary',
      linkedId: primary.id,
    });
  }

  const updatedContacts = await findRelevantContacts(email, phoneNumber);
  return consolidateContacts(updatedContacts);
};


export default {
    identifyContact
}
