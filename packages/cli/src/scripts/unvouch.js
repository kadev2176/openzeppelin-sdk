const BigNumber = web3.BigNumber
const contract = require("truffle-contract")
const promptBoolean = require('../utils/promptBoolean')
const KERNEL_ADDRESS = require('../utils/constants').KERNEL_ADDRESS

async function unvouch() {
  const data = ''
  const amount = new BigNumber(10)

  const releaseAddress = '0x575c467d94f0abde1bca0d529eb233fd5f27d0b4'
  const voucher = web3.eth.accounts[2]

  const Kernel = contract(require('zos-kernel/build/contracts/Kernel.json'))
  Kernel.setProvider(web3.currentProvider)
  const kernel = Kernel.at(KERNEL_ADDRESS)

  const Vouching = contract(require('zos-kernel/build/contracts/Vouching.json'))
  Vouching.setProvider(web3.currentProvider)
  const vouching = Vouching.at(await kernel.vouches())

  const txParams = { from: voucher, gas: 6000000  }

  const isRegistered = await kernel.isRegistered(releaseAddress, txParams)
  if(!isRegistered) {
    console.error(`Given release ${releaseAddress} is not registered yet.`)
    return
  }

  const vouches = await vouching.vouchedFor(voucher, releaseAddress)
  const doesNotHaveEnoughVouches = vouches.lt(amount)
  if(doesNotHaveEnoughVouches) {
    console.error("You don't have enough vouches to unvouch given amount.")
    return
  }

  promptBoolean(`Are you sure you want to unvouch ${amount} ZEP tokens from release ${releaseAddress}?`, async function () {
    try {
      console.log(`Unvouching ${amount} ZEP tokens from release ${releaseAddress}...`)
      const receipt = await kernel.unvouch(releaseAddress, amount, data, txParams)
      console.log(`Unvouch processed successfully. Transaction hash: ${receipt.transactionHash}.`)
    } catch (error) {
      console.error('There was an error trying to unvouch your tokens.', error)
    }
  })
}

module.exports = function(cb) {
  unvouch().then(cb).catch(cb)
}
