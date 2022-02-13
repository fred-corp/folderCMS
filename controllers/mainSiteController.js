const config = require("../server-config.json")
const mainSite = require('../models/mainSiteModel')

exports.homePage = function (req, res) {
  res.render('mainSite.ejs', {siteTitle: config.siteTitle, siteName: config.siteName, theme: config.theme})
}
