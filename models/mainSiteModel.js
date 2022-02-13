class mainSite {
  constructor (name) {
    this.name = name
  }

  setName (newName) {
    this.name = newName
  }

  getName () {
    return this.name
  }
}

module.exports = mainSite
