// This example describes how to login using a launcher_profiles folder instead of a usual minecraft username & password

const mineflayer = require('mineflayer')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

if (process.argv.length !== 5) {
  console.log('Usage : node session.js <host> <port> <pathToLauncherProfiles>')
  process.exit(1)
}

const homeDir = fs.realpathSync(os.homedir())
const requestedProfilesDir = path.resolve(process.argv[4])
let profilesDir

try {
  profilesDir = fs.realpathSync(requestedProfilesDir)
} catch {
  console.error('Error: launcher profiles directory does not exist or cannot be accessed')
  process.exit(1)
}

const relativeProfilesPath = path.relative(homeDir, profilesDir)
if (relativeProfilesPath === '..' || relativeProfilesPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeProfilesPath)) {
  console.error('Error: launcher profiles path must be within your home directory')
  process.exit(1)
}

const profilePath = fs.realpathSync(path.join(profilesDir, 'launcher_profiles.json'))
const relativeProfilePath = path.relative(profilesDir, profilePath)
if (relativeProfilePath === '..' || relativeProfilePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeProfilePath)) {
  console.error('Error: launcher profiles file must remain within the selected directory')
  process.exit(1)
}

const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
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
