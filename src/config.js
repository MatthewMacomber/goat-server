module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://goat@localhost/goatful',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://goat@localhost/goatful-test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}; // TODO Add/Remove/Change config.
