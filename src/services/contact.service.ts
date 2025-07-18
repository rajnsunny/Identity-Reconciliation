import { Op, InferCreationAttributes } from 'sequelize';
import db from '../models';

const findRelevantContacts = async (email?: string | null, phoneNumber?: string | null) => {

  const condition = [];

  if (email) condition.push({ email });
  
  if (phoneNumber) condition.push({ phoneNumber });

  return db.Contact.findAll({
    where: {
      [Op.or]: condition
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

const consolidateContacts = async (primaryId: number) => {
  const contacts = await db.Contact.findAll({
    where: {
      [Op.or]: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    },
  });

  const result = contacts.reduce(
    (acc, contact) => {
      if (contact.email) acc.emails.add(contact.email);
      if (contact.phoneNumber) acc.phoneNumbers.add(contact.phoneNumber);
      if (contact.linkedId) acc.secondaryIds.push(contact.id);
      return acc;
    },
    {
      emails: new Set<string>(),
      phoneNumbers: new Set<string>(),
      secondaryIds: [] as number[],
    }
  );

  return {
    primaryContactId: primaryId,
    emails: Array.from(result.emails),
    phoneNumbers: Array.from(result.phoneNumbers),
    secondaryContactIds: result.secondaryIds,
  };
};

const updatePrimaryContactToSecondary = async (oldPrimaryId: number,newPrimaryId: number) => {
  await db.Contact.update(
    {
      linkPrecedence: 'secondary',
      linkedId: newPrimaryId
    },
    {
      where: {
        [Op.or]: [
          { id: oldPrimaryId },
          { linkedId: oldPrimaryId }
        ]
      }
    }

  )
};

const identifyContact = async (email?: string, phoneNumber?: string) => {

  const contacts = await findRelevantContacts(email,phoneNumber);

  const hasNewEmail = email ? !contacts.some(c => c.email === email) : false;
  const hasNewPhoneNumber = phoneNumber ? !contacts.some(c => c.phoneNumber === phoneNumber) : false;
  
  const ids = Array.from( new Set( contacts.map(c => c.linkedId ?? c.id)));
  console.log(ids);
  
  if(hasNewEmail || hasNewPhoneNumber){                                // case 1: New Fields (Email Or PhoneNumber)
    const contact = await createContact({
      email,
      phoneNumber,
      linkedId: ids[0] ?? null,
      linkPrecedence: ids[0] ? 'secondary' : 'primary'
    })

    return consolidateContacts(ids[0] ?? contact.id);                 
  }
  if(ids.length == 2) await updatePrimaryContactToSecondary(ids[1],ids[0]);   // Case 2: Merge two contact groups → update one to secondary           

  return consolidateContacts(ids[0]);
};


export default identifyContact;