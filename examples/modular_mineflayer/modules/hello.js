const mineflayer = require('mineflayer')

/**
 * @param {mineflayer.Bot} bot // to enable intellisense
 */

module.exports = function helloModule (bot) {
  bot.addChatPattern('hello', /<([^ >]+)> (?:Hello|hello)/, { parse: true })

  bot.on('chat:hello', ([[playerIgn]]) => {
    bot.chat(`Hi, ${playerIgn}`)
  })
}
