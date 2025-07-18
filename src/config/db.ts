import { Sequelize } from 'sequelize';
import Appconfig from './appConfig';

const sequelize = new Sequelize(
  Appconfig.DATABASE_NAME,
  Appconfig.DATABASE_USERNAME,
  Appconfig.DATABASE_PASSWORD,
  {
    host: Appconfig.DATABASE_HOST || 'localhost',
    port: Number(Appconfig.DATABASE_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: false,
  }
);



export default sequelize;
