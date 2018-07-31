import PackageFilesInterface from '../utils/PackageFilesInterface'
import Logger from '../utils/Logger'

const log = new Logger('new-version')

async function newVersion(version, stdlibName, { network, from, packageFileName }) {
  if (version === undefined) {
    log.error('Must provide the new project version')
    return
  }

  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = files.read()
  zosPackage.version = version
  zosPackage.contracts = {}
  await files.setStdlib(zosPackage, stdlibName)
    
  files.write(zosPackage)
}

module.exports = newVersion
