import AppManager from '../models/AppManager'
import makeContract from '../utils/contract'
import PackageFilesInterface from '../utils/PackageFilesInterface'

async function createProxy(contractAlias, { initArgs, network, from, packageFileName }) {
  if (contractAlias === undefined) throw 'Must provide a contract alias'

  // TODO: if network file does not exists, create it
  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = files.read()
  const zosNetworkFile = files.readNetworkFile(network)
  const { proxies } = zosNetworkFile

  const appManager = new AppManager(from)
  await appManager.connect(zosNetworkFile.app.address)

  const contractName = zosPackage.contracts[contractAlias]
  if (!contractName) throw `Could not find ${contractAlias} contract in zOS package file`

  const contractClass = makeContract(contractName)
  const proxyInstance = await appManager.createProxy(contractClass, contractAlias, 'initialize', initArgs)
  // TODO: Support more than one initialize function

  const { address } = proxyInstance
  const { version } = appManager

  proxies[contractAlias] = proxies[contractAlias] || []
  proxies[contractAlias].push({ address, version })

  zosNetworkFile.proxies = proxies
  files.writeNetworkFile(network, zosNetworkFile)
}

module.exports = createProxy
