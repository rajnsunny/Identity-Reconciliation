import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

class Contact extends Model {
    declare id: number;
    declare email: string | null;
    declare phoneNumber: string | null;
    declare linkedId: number | null;
    declare linkPrecedence: 'primary' | 'secondary';
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date | null;
}

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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
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
