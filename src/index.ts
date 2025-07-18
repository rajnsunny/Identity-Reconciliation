import express from 'express';
import  { sequelize, Appconfig }  from './config';
import routes from './routes';
const app = express();


app.use(express.json());
app.use('/', routes);


app.get('/', (_, res) => res.send('Hello from Express + Sequelize'));

sequelize.sync({ alter: true }) // or { force: true } for dev reset
  .then(() => {
    console.log('✅ Database synced');
    app.listen(Appconfig.PORT, () => {
      console.log(`🚀 Server is running on port ${Appconfig.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error syncing database:', err);
  });
