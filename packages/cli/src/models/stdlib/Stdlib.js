import StdlibInstaller from './StdlibInstaller';
import { FileSystem as fs } from 'zos-lib'
import _ from 'lodash';

export default class Stdlib {
  constructor(nameAndVersion) {
    this._parseNameVersion(nameAndVersion)
  }

  getName() {
    return this.name
  }

  // TODO: Provided version and package.json version may not match, raise an error if so
  getVersion() {
    if (this.version) return this.version
    return this.getPackage().version
  }

  getPackage() {
    if (this._packageJson) return this._packageJson
    const filename = `node_modules/${this.name}/package.zos.json`
    this._packageJson = fs.parseJson(filename)
    return this._packageJson
  }

  hasContract(alias) {
    if (!this.getPackage().contracts) return false;
    return !_.isEmpty(this.getPackage().contracts[alias]);
  }
  
  async install() {
    await StdlibInstaller.call(this.nameAndVersion)
  }

  _parseNameVersion(nameAndVersion) {
    const [name, version] = nameAndVersion.split('@')
    this.name = name
    this.version = version
    this.nameAndVersion = nameAndVersion;
  }

  static equalNameAndVersion(stdlib1, stdlib2) {
    return stdlib1.name === stdlib2.name
      && (stdlib1.getVersion ? stdlib1.getVersion() : stdlib1.version) === (stdlib2.getVersion ? stdlib2.getVersion() : stdlib2.version);
  }
}
