export const config = {
  database: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
  application: {
    port: process.env.PORT || 3333,
    documentUrl: process.env.DOCUMENT_URL,
  },
  env: {
    privateKey: process.env.PRIVATE_KEY,
    applications: process.env.APPLICATIONS,
  },
};
