import AppController from "../models/AppController";

export default async function upgradeProxy({ contractAlias, proxyAddress, initMethod, initArgs, network, txParams = {}, packageFileName = null, networkFileName = null }) {
  const appController = new AppController(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.upgradeProxy(contractAlias, proxyAddress, initMethod, initArgs);
  appController.writeNetworkPackage();
}
