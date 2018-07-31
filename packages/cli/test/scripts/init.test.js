import init from "../../src/scripts/init.js";
import fs from 'fs';
import PackageFilesInterface from '../../utils/PackageFilesInterface';

contract.only('init', function(accounts) {

  const packageFileName = "package.test.zos.json";
  const appName = "MyApp";
  const defaultVersion = "1.0.0";
  const files = new PackageFilesInterface(packageFileName);

  afterEach('cleanup', function() {
    console.log('cleaning up files...');
    fs.unlinkSync(packageFileName);
  });

  describe('created file', function() {

    it('should exist', function() {
      init(appName, defaultVersion , packageFileName);
      assert.equal(true, fs.existsSync(packageFileName));
    });

    it('should have the appropriate app name', function() {
      init(appName, defaultVersion, packageFileName);
      const data = files.read();
      data.name.should.eq(appName);
    });

    it('should have a default version if not specified', function() {
      init(appName, null, packageFileName);
      const data = files.read();
      data.version.should.eq(defaultVersion);
    });

    it('should have the appropriate version', function() {
      const customVersion = '0.2.24';
      init(appName, customVersion, packageFileName);
      const data = files.read();
      data.version.should.eq(customVersion);
    });
  });
});
