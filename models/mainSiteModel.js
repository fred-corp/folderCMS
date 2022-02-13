class mainSite {
  constructor (siteName, theme) {
    this.siteName = siteName
    this.theme = theme
  }

  setName (newName) {
    this.siteName = newName
  }

  getName () {
    return this.siteName
  }
}

module.exports = mainSite
