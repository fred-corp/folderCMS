const config = require('../server-config.json')
const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

const navBarDict = { active: 0, items: [{type:'page', name:'Home', URL:'/', path:'website/01.Home/', float:'none'}, {type:'page', name:'Test', URL:'/test', path:'website/01.Home/'}, {type:'page', name:'page', name:'About', URL:'/about', path:'website/03.About/'}] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01.Home/page.md').toString())
  res.render('mainSite.ejs', { navBar: navBarDict, config: config, content: html })
}
