import express from 'express';
import  { Appconfig }  from './config';
import routes from './routes';
const app = express();


app.use(express.json());
app.use('/', routes);


app.get('/', (_, res) => res.send('Hello from Express + Sequelize'));

app.listen(Appconfig.PORT, () => {
      console.log(`🚀 Server is running on port ${Appconfig.PORT}`);
    });
