const program = require('commander')
const { version } = require('../../package.json')
const registerUserCommands = require('./users')
const registerDeveloperCommands = require('./developers')
const registerErrorHandler = require('./errors')

program
  .name('zos')
  .usage('<command> [options]')
  .version(version, '--version')
  .option('-v, --verbose', 'Switch verbose mode on. Output errors stacktrace.')

registerUserCommands(program)
registerDeveloperCommands(program)
registerErrorHandler(program)

module.exports = program;
