require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Compatibilidade com MySQL 8+ (caching_sha2_password)
      authPlugins: {
        caching_sha2_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
      }
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};
