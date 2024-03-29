
const fs = require('fs')

class config {
  constructor (baseConfig) {
    this.siteTitle = baseConfig.siteTitle
    this.theme = baseConfig.theme
    this.settingsURL = baseConfig.settingsURL
    this.isSet = baseConfig.isSet
  }

  // readConfig() variables from config file
  readConfig () {
    const config = JSON.parse(fs.readFileSync('website/config/server-config.json').toString())
    this.siteTitle = config.siteTitle
    this.theme = config.theme
    this.settingsURL = config.settingsURL
    this.isSet = config.isSet
  }

  // writeConfig(newConfig) variables to config file, and update config object
  writeConfig (newConfig) {
    fs.writeFileSync('website/config/server-config.json', JSON.stringify(newConfig, null, 2))
    this.siteTitle = newConfig.siteTitle
    this.theme = newConfig.theme
    this.settingsURL = newConfig.settingsURL
    this.isSet = newConfig.isSet
  }

}

module.exports = config
