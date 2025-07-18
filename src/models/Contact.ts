import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'Contacts',
    timestamps: true,
    paranoid: true, 
  }
);

export default Contact;
