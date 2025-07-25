import 'dotenv/config'; 
const Appconfig = {
    DATABASE_HOST : process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME || '',
    PORT: process.env.PORT
}

export default Appconfig;
