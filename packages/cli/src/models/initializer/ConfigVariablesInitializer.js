import { ZWeb3, Contracts } from 'zos-lib'
import Truffle from './truffle/Truffle'
import Session from '../network/Session'
import Compiler from '../compiler/Compiler'

const ConfigVariablesInitializer = {
  initStaticConfiguration() {
    const buildDir = Truffle.getBuildDir()
    Contracts.setLocalBuildDir(buildDir)

    const solcSettings = Truffle.getSolcSettings()
    Compiler.setSettings(solcSettings)
  },

  async initNetworkConfiguration(options) {
    const { network, from, timeout } = Session.getOptions(options)
    if (!network) throw Error('A network name must be provided to execute the requested action.')

    // these lines could be expanded to support different libraries like embark, ethjs, buidler, etc
    Truffle.validateAndLoadNetworkConfig(network)
    const { provider, artifactDefaults } = Truffle.getProviderAndDefaults()

    ZWeb3.initialize(provider)
    Contracts.setSyncTimeout(timeout * 1000)
    Contracts.setLocalBuildDir(buildDir)
    Contracts.setArtifactsDefaults(artifactDefaults)

    const txParams = from ? { from } : { from: await ZWeb3.defaultAccount() }
    return { network: await ZWeb3.getNetworkName(), txParams }
  }
}

export default ConfigVariablesInitializer