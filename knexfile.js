require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'access_management_db',
      user:     process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port:     process.env.DB_PORT || 5432
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};