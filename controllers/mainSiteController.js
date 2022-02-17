const config = require("../server-config.json")
const mainSite = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

exports.homePage = function (req, res) {
  let html = marked.parse(fs.readFileSync('website/01.Home.md').toString())
  const navBarDict = {active: 0, right: 2, items: [["page", "Home", "/"], ["page", "Test", "/test"], ["page", "About", "/about"]]}
  res.render('mainSite.ejs', {navBar: navBarDict, siteTitle: config.siteTitle, theme: config.theme, siteName: config.siteName, content: html})
}
