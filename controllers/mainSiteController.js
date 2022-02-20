const config = require('../server-config.json')
const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

const navBarDict = { active: 0, items: [{type:'page', name:'Home', URL:'/', pageFile:'website/01.Home/page.md', float:'none'}, {type:'page', name:'Test', URL:'/test', pageFile:'website/01.Home/page.md'}, {type:'page', name:'page', name:'About', URL:'/about', pageFile:'website/03.About/page.md'}] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01.Home/page.md').toString())
  res.render('mainSite.ejs', { navBar: navBarDict, config: config, content: html })
}
