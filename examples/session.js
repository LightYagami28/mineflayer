// This example describes how to login using a launcher_profiles folder instead of a usual minecraft username & password

const mineflayer = require('mineflayer')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

if (process.argv.length !== 5) {
  console.log('Usage : node session.js <host> <port> <pathToLauncherProfiles>')
  process.exit(1)
}

const profilesDir = path.resolve(process.argv[4])
if (!profilesDir.startsWith(os.homedir())) {
  console.error('Error: launcher profiles path must be within your home directory')
  process.exit(1)
}
const profile = JSON.parse(fs.readFileSync(path.join(profilesDir, 'launcher_profiles.json'), 'utf8'))
const auth = profile.authenticationDatabase[profile.selectedUser.account]
const profileID = profile.selectedUser.profile

const session = {
  accessToken: auth.accessToken,
  clientToken: profile.clientToken,
  selectedProfile: {
    id: profileID,
    name: auth.profiles[profileID].displayName
  }
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: Number.parseInt(process.argv[3]),
  session
})

bot.once('login', () => {
  console.log('logged in')
  bot.quit()
})
