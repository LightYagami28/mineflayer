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
const relativeProfilesPath = path.relative(homeDir, requestedProfilesDir)
if (relativeProfilesPath === '..' || relativeProfilesPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeProfilesPath)) {
  console.error('Error: launcher profiles path must be within your home directory')
  process.exit(1)
}

// Resolve each path segment against names enumerated from the already trusted
// parent directory. User-supplied path text is never passed to a filesystem API.
let profilesDir = homeDir
for (const requestedSegment of relativeProfilesPath.split(path.sep).filter(Boolean)) {
  const matchingDirectory = fs.readdirSync(profilesDir, { withFileTypes: true })
    .find(entry => entry.name === requestedSegment && entry.isDirectory())
  if (!matchingDirectory) {
    console.error('Error: launcher profiles directory must exist within your home directory')
    process.exit(1)
  }

  const nextDirectory = path.join(profilesDir, matchingDirectory.name)
  const realNextDirectory = fs.realpathSync(nextDirectory)
  const relativeNextDirectory = path.relative(homeDir, realNextDirectory)
  if (relativeNextDirectory === '..' || relativeNextDirectory.startsWith(`..${path.sep}`) || path.isAbsolute(relativeNextDirectory)) {
    console.error('Error: launcher profiles directory must remain within your home directory')
    process.exit(1)
  }
  profilesDir = realNextDirectory
}

const profilePath = path.join(profilesDir, 'launcher_profiles.json')
const profileFile = fs.lstatSync(profilePath)
if (!profileFile.isFile() || profileFile.isSymbolicLink()) {
  console.error('Error: launcher profiles must be a regular file')
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
