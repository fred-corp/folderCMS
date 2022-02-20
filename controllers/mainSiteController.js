const config = require('../server-config.json')
// const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
// const path = require('path')
const directoryTree = require('directory-tree')
const marked = require('marked')

// const navBarDict = { active: 0, items: [{ type: 'page', name: 'Home', URL: '/', path: 'website/01.Home/', float: 'none' }, { type: 'page', name: 'Test', URL: '/test', path: 'website/01.Home/' }, {type: 'page', name: 'About', URL: '/about', path: 'website/03.About/' }] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01.Home/page.md').toString())
  res.render('mainSite.ejs', { navBar: searchPages(), config: config, content: html })
}

function searchPages () {
  const website = directoryTree(config.websiteDir, { attributes: ['type', 'extension'], normalizePath: true })

  const navBarDict = {}
  navBarDict.active = 0
  navBarDict.items = []

  function getInfo (element) {
    if (Object.prototype.hasOwnProperty.call(element, 'children')) {
      const conf = require('../' + element.path + '/conf.json')
      if (conf.type === 'page') {
        return parseElement(element)
      } else if (conf.type === 'folder') {
        const item = parseElement(element)
        const items = []
        for (let index = 0; index < element.children.length; index++) {
          const child = element.children[index]
          const subItem = getInfo(child)
          if (typeof subItem !== 'undefined') {
            items.push(subItem)
          }
        }
        item.subpages = items

        return item
      }
    }
  }

  function parseElement (element) {
    const item = {}
    const subnames = element.path.split('/')
    const indexAndName = subnames[subnames.length - 1].split('.')
    item.name = indexAndName[1]
    item.index = parseInt(indexAndName[0])
    item.path = element.path
    const conf = require('../' + element.path + '/conf.json')
    item.type = conf.type
    item.URL = conf.URL
    item.float = conf.navbar.desktop.float
    return item
  }

  const items = []
  for (let index = 0; index < website.children.length; index++) {
    const child = website.children[index]
    items.push(getInfo(child))
  }
  navBarDict.items = items

  console.log(navBarDict)

  return navBarDict
}
