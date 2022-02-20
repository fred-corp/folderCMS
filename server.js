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

  function getInfo(element) {
    if(element.hasOwnProperty('children')) {
      for (let index = 0; index < element.children.length; index++) {
        const child = element.children[index]
        getInfo(child)
      }
    } else {
      parseElement(element)
    }
  }

  function parseElement(element){
    const subnames = element.path.split('/')
    console.log(subnames)
    if(subnames.length <= 3) {
      const index_name = subnames[subnames.length-2].split('.')
      if (element.extension == '.md') {
        navBarDict.items[parseInt(index_name[0]) - 1].type = 'page' 
        navBarDict.items[parseInt(index_name[0]) - 1].name = index_name[1]
        navBarDict.items[parseInt(index_name[0]) - 1].pageFile = element.path
      } else if (element.extension == '.json') {
        const conf = require('./' + element.path)
        navBarDict.items[parseInt(index_name[0]) - 1] = {}
        navBarDict.items[parseInt(index_name[0]) - 1].URL = conf.URL
        navBarDict.items[parseInt(index_name[0]) - 1].float = conf.navbar.desktop.float
      }
    }
  }

  for (let index = 0; index < website.children.length; index++) {
    const child = website.children[index]
    getInfo(child)
    
  }

  console.log(navBarDict)

  // Now to send this dictionary somewhere...

}

setInterval(searchPages, config.refreshInterval<1 ? 1000 : config.refreshInterval * 1000)
