const config = require("../server-config.json")
const mainSite = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

exports.homePage = function (req, res) {
  let html = marked.parse(fs.readFileSync('website/01.Home.md').toString())
  res.render('mainSite.ejs', {siteTitle: config.siteTitle, theme: config.theme, siteName: config.siteName, content: html})
}
