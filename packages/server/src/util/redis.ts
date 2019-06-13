import Redis = require('ioredis');

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});
