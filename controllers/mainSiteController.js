const mainSite = require('../models/mainSiteModel')

exports.homePage = function (req, res) {
  res.status(200).send('<h1>Hey!</h1>')
}
