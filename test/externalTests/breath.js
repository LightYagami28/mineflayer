const assert = require('node:assert')

module.exports = () => async (bot) => {
  await bot.waitForChunksToLoad()
  if (bot.oxygenLevel) assert.strictEqual(bot.oxygenLevel, 20, 'Wrong oxygen level')
}
