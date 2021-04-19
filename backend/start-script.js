const database = require('./src/database')

module.exports = async () => {
  console.log('connecting')
  await database.connect(process.env.MONGO_URL)
}
