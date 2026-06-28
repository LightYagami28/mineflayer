const assert = require('node:assert')

module.exports = () => async (bot) => {
  assert.strictEqual(bot._getDimensionName(), 'minecraft:overworld')
}
