const MONGO_URL = process.env.MONGO_URL || undefined
const REDIS_URL = process.env.REDIS_URL || undefined

module.exports = {
  MONGO_URL: 'mongodb://root:example@mongo:27017/the_database?authSource=admin',
  REDIS_URL: 'redis://redis:6379'
}