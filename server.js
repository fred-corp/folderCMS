const express = require('express')
const app = express()
const routes = require('./routes')
const config = require('./server-config.json')
const fs = require('fs')
const path = require('path')
const directoryTree = require('directory-tree')
const { connected } = require('process')

const websiteDir = config.websiteDir

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', routes)

app.listen(config.port, function () {
  console.log('server is listening on port ' + config.port)
})


// TODO : add folder capability to navbar item
function searchPages () {
  var website = directoryTree(config.websiteDir, {attributes:['type', 'extension'], normalizePath:true})
  
  var navBarDict = {}
  navBarDict.active = 0
  navBarDict.items = []

  function getInfo(element, called) {
    if(element.hasOwnProperty('children')) {
      const conf = require('./' + element.path + '/conf.json')
      if(conf.type == 'page') {
        return parseElement(element, called)
      } 
      else if (conf.type == 'folder') {
        let item = parseElement(element, called)
        if (called == false){
          var items = []
          for (let index = 0; index < element.children.length; index++) {
            const child = element.children[index]
            let subItem = getInfo(child, true)
            if (typeof subItem !== 'undefined') {
              items.push(getInfo(child, true))
            }
          }
          item.subpages = items
        }
        return item
      }
    }
  }

  function parseElement(element, called){
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
    items.push(getInfo(child, false))
  }
  navBarDict.items = items

  console.log(navBarDict)
  console.log(navBarDict.items[1].subpages)

  // Now to send this dictionary somewhere...

}

setInterval(searchPages, config.refreshInterval<1 ? 1000 : config.refreshInterval * 1000)
