const config = require('../server-config.json')
const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const marked = require('marked')

const navBarDict = { active: 0, items: [{type:'page', name:'Home', URL:'/', path:'website/01.Home/', float:'none'}, {type:'page', name:'Test', URL:'/test', path:'website/01.Home/'}, {type:'page', name:'page', name:'About', URL:'/about', path:'website/03.About/'}] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01.Home/page.md').toString())
  res.render('mainSite.ejs', { navBar: navBarDict, config: config, content: html })
}


function searchPages () {
  var website = directoryTree(config.websiteDir, {attributes:['type', 'extension'], normalizePath:true})
  
  var navBarDict = {}
  navBarDict.active = 0
  navBarDict.items = []

  function getInfo(element) {
    if(element.hasOwnProperty('children')) {
      const conf = require('./' + element.path + '/conf.json')
      if(conf.type == 'page') {
        return parseElement(element)
      } 
      else if (conf.type == 'folder') {
        let item = parseElement(element)
        var items = []
        for (let index = 0; index < element.children.length; index++) {
          const child = element.children[index]
          let subItem = getInfo(child)
          if (typeof subItem !== 'undefined') {
            items.push(subItem)
          }
        }
        item.subpages = items
        
        return item
      }
    }
  }

  function parseElement(element){
    var item = {}
    const subnames = element.path.split('/')
    const index_name = subnames[subnames.length-1].split('.')
    item = {}
    item.name = index_name[1]
    item.index = parseInt(index_name[0])
    item.path = element.path
    const conf = require('./' + element.path + '/conf.json')
    item.type = conf.type
    item.URL = conf.URL
    item.float = conf.navbar.desktop.float
    return item
  }

  var items = []
  for (let index = 0; index < website.children.length; index++) {
    const child = website.children[index]
    items.push(getInfo(child))
  }
  navBarDict.items = items

  console.log(navBarDict)

  return navBarDict
}
