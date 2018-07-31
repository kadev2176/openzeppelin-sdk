import PackageFilesInterface from '../utils/PackageFilesInterface'

const DEFAULT_VERSION = '0.1.0'
const BASE_PACKAGE = {
  'version': null,
  'contracts': {},
  'stdlib': {}
}

const interface = new PackageFilesInterface();

export default function init(name, version, { from }) {
  const zosPackage = BASE_PACKAGE

  zosPackage.name = name
  zosPackage.version = version || DEFAULT_VERSION

  interface.write(zosPackage)
}
