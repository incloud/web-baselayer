const prefix = path =>
  `${process.env.NODE_ENV === 'production' ? 'dist' : 'src'}/${path}`;

module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [prefix('entity/**/*.*')],
  migrations: [prefix('migration/**/*.*')],
  subscribers: [prefix('subscriber/**/*.*')],
  cli: {
    entitiesDir: prefix('entity'),
    migrationsDir: prefix('migration'),
    subscribersDir: prefix('subscriber'),
  },
};
