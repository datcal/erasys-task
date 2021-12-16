const configuration = () => ({
  database: {
    client: process.env.DATABASE_CLIENT || 'mysql',
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number.parseInt(process.env.DATABASE_PORT, 10) || 3306,
  },
  api: {
    validation: process.env.VALIDATION_API,
    compromised: process.env.COMPROMISED_API,
  },
  app: {
    debug: process.env.APP_DEBUG || false,
    logType: process.env.APP_LOG_TYPE || 'logger',
    port: Number.parseInt(process.env.PORT, 10) || 3000,
  },
});

export default configuration;
