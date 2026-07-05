const assert = require('node:assert')

const breathTest = () => async (bot) => {
  await bot.waitForChunksToLoad()
  if (bot.oxygenLevel) assert.strictEqual(bot.oxygenLevel, 20, 'Wrong oxygen level')
}
module.exports = breathTest
