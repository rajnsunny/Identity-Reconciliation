import express from 'express';
import  { sequelize,Appconfig }  from './config';
const app = express();


app.use(express.json());

app.get('/', (_, res) => res.send('Hello from Express + Sequelize'));

app.listen(Appconfig.PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`🚀 Server running on http://localhost:${Appconfig.PORT}`);
});
