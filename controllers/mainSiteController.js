const config = require('../server-config.json')
const mainSite = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

const navBarDict = { active: 0, right: 2, items: [['page', 'Home', '/'], ['page', 'Test', '/test'], ['page', 'About', '/about']] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01.Home/page.md').toString())
  res.render('mainSite.ejs', { navBar: navBarDict, config: config, content: html })
}
