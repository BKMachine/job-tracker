const database = require('./src/database')

module.exports = async () => {
  console.log('disconnecting')
  await database.disconnect()
}
