class mainSite {
  constructor (config) {
    this.siteTitle = config.siteTitle
    this.siteName = config.siteName
    this.theme = config.theme
    this.websiteDir = config.websiteDir
    this.refreshInterval = config.refreshInterval
  }
}

module.exports = mainSite
