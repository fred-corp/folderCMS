const config = require('../server-config.json')
// const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
// const path = require('path')
const directoryTree = require('directory-tree')
const marked = require('marked')

// const navBarDict = { active: 0, items: [{ type: 'page', name: 'Home', URL: '/', path: 'website/01.Home/', float: 'none' }, { type: 'page', name: 'Test', URL: '/test', path: 'website/01.Home/' }, {type: 'page', name: 'About', URL: '/about', path: 'website/03.About/' }] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01-Home-none/page.md').toString())
  res.render('mainSite.ejs', { navBar: searchPages(), config: config, content: html })
}

function searchPages () {
  const website = directoryTree(config.websiteDir+'/pages', { attributes: ['type', 'extension'], normalizePath: true })

  const navBarDict = {}
  navBarDict.active = ""
  navBarDict.items = []

  // parse a directory name that looks like "01-Home Page" or "01-Home Page-none" into "01", "Home Page", and "none" with regex
  const dirNameRegex = /(\d\d)-(.*)-(.*)/

  // Store the directory's name in a dictionary with the key being the first element in regex match, recursively for all subdirectories, and sub-subdirectories, etc.if the directory has childrenstore witha "child" key)
  let dirDict = {}
  function parseDir(dir) {
    const dirName = dir.name
    const dirNameMatch = dirNameRegex.exec(dirName)
    if (dirNameMatch) {
      const dirNum = dirNameMatch[1]
      const dirName = dirNameMatch[2]
      const dirFloat = dirNameMatch[3]
      const dirPath = dir.path
      var URL = ('/' + dirName).replace(' ', '_')
      const dirDictionary = {}
      dirDictionary[dirNum] = { name: dirName, URL: URL, float: dirFloat, path: dirPath}


      if (dir.children) {
        dirDictionary[dirNum].folders = {}
        for (let i = 0; i < dir.children.length; i++) {
          const child = dir.children[i]
          if (child.type === 'directory') {
            const childDict = parseDir(child)
            // for each key in childDict, change URL to be the parent's URL + child's URL
            for (const key in childDict) {
              childDict[key].URL = dirDictionary[dirNum].URL + childDict[key].URL
            }
            dirDictionary[dirNum].folders = Object.assign(dirDictionary[dirNum].folders, childDict)
            
          } else if (child.type === 'file' && child.extension === '.md') {
            const pageName = child.name.replace('.md', '')
            dirDictionary[dirNum][pageName] = { name: pageName, path: child.path }
          }
        }
      }
      //}
      return dirDictionary
    }
  }

  // parse for each element in website.children
  website.children.forEach(dir =>{
    toAppend = parseDir(dir)
    dirDict = { ...dirDict, ...toAppend }
  })

  // convert dirDict to navBarDict recursively
  function convertDirDictToNavBarDict (dirDict) {
    const navBarItem = []
    for (const key in dirDict) {
      const dir = dirDict[key]
      if (dir.folders) {
        navBarItem.push({ type: 'menu', name: dir.name, URL: dir.URL, path: dir.path, float: dir.float, childs : convertDirDictToNavBarDict(dir.folders)})
        // remove childs if empty and change type to 'page
        if (navBarItem[navBarItem.length - 1].childs.length === 0) {
          navBarItem[navBarItem.length - 1].type = 'page'
          delete navBarItem[navBarItem.length - 1].childs
        }
      } else {
        navBarItem.push({ type: 'page', name: dir.name, URL: dir.URL, path: dir.path, float: dir.float })
      }
    }
    return navBarItem
  }

  navBarDict.items = convertDirDictToNavBarDict(dirDict)
  return navBarDict
}

// create a URL LUT from navBarDict recursively
function getURLLUT (navBarDict) {
  const URLLUT = {}


  function parseNavBarDict (navBarDict) {
    for (let i = 0; i < navBarDict.length; i++) {
      const navBarItem = navBarDict[i]
      if (navBarItem.type === 'page') {
        URLLUT[navBarItem.URL] = navBarItem
      } else if (navBarItem.type === 'menu') {
        URLLUT[navBarItem.URL] = navBarItem
        parseNavBarDict(navBarItem.childs)
      }
    }
  }

  parseNavBarDict(navBarDict.items)

  // remove childs from each navBarItem
  for (const key in URLLUT) {
    if (URLLUT[key].childs) {
      delete URLLUT[key].childs
    }
  }

  return URLLUT
}

exports.getPage = function (req, res) {
  const page = req.params['0']
  const navBarDict = searchPages()
  const urlLUT = getURLLUT(navBarDict)
  const pageDict = urlLUT['/' + page]
  navBarDict.active = pageDict.name
  if (pageDict) {
    const html = marked.parse(fs.readFileSync(pageDict.path + '/page.md').toString())
    const footer = {}
    footer.left = marked.parse(fs.readFileSync(config.websiteDir+'/footer/left.md').toString())
    footer.middle = marked.parse(fs.readFileSync(config.websiteDir+'/footer/middle.md').toString())
    footer.right = marked.parse(fs.readFileSync(config.websiteDir+'/footer/right.md').toString())
    res.render('mainSite.ejs', { navBar: navBarDict, config: config, content: html , footer: footer})
  } else {
    res.render('404.ejs', { navBar: navBarDict, config: config })
  }
}