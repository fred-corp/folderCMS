const baseConfig = require('../config/server-config.json')
const configModel = require('../models/configModel')
// const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const directoryTree = require('directory-tree')
const marked = require('marked')

// create a new configModel object
const config = new configModel(baseConfig)

// const navBarDict = { active: 0, items: [{ type: 'page', name: 'Home', URL: '/', path: 'website/01.Home/', float: 'none' }, { type: 'page', name: 'Test', URL: '/test', path: 'website/01.Home/' }, {type: 'page', name: 'About', URL: '/about', path: 'website/03.About/' }] }

exports.homePage = function (req, res) {
  const html = marked.parse(fs.readFileSync('website/01-Home-none/page.md').toString())
  res.render('mainSite.ejs', { navBar: searchPages(), config: config, content: html })
}

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}


// parse a directory name that looks like "01-Home Page" or "01-Home Page-none" into "01", "Home Page", and "none" with regex
const dirNameRegex = /(\d\d)-(.*)-(.*)/

function searchPages () {
  const website = directoryTree('website/pages', { attributes: ['type', 'extension'], normalizePath: true })

  const navBarDict = {}
  navBarDict.active = ""
  navBarDict.items = []


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
      if (!isEmptyObject(dir.folders)) {
        navBarItem.push({ type: 'menu', name: dir.name, URL: dir.URL, path: dir.path, float: dir.float, childs : convertDirDictToNavBarDict(dir.folders)})
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
const getURLLUT = function (_navBarDict) {
  const URLLUT = {}


  function parseNavBarDict (__navBarDict) {
    for (let i = 0; i < __navBarDict.length; i++) {
      const navBarItem = __navBarDict[i]
      if (navBarItem.type === 'page') {
        URLLUT[navBarItem.URL] = navBarItem
      } else if (navBarItem.type === 'menu') {
        URLLUT[navBarItem.URL] = navBarItem
        parseNavBarDict(navBarItem.childs)
      }
    }
  }

  parseNavBarDict(_navBarDict.items)


  // add the parent URL to the child URL if it hasn't been added yet
  // for example if URL is /subfolder and subfloder is in Folder, add /Folder in front
  for (const key in URLLUT) {
    if (URLLUT[key].type === 'page') {
      const URL = URLLUT[key].URL
      const path = URLLUT[key].path
      const pathSplit = path.split('/')
      const pathSplitLength = pathSplit.length
      if (pathSplitLength > 2) {
        const dirNameMatch = dirNameRegex.exec(pathSplit[2])
        if (dirNameMatch) {
          const parentURL = ('/' + dirNameMatch[2]).replace(' ', '_')
          if (!URL.startsWith(parentURL)) {
            //change key of element in URLLUT
            const newKey = parentURL + URL
            URLLUT[newKey] = URLLUT[key]
            delete URLLUT[key]
          }
        }
      }
    }
  }
  
  return URLLUT
}

let navBarDict = searchPages()
let urlLUT = getURLLUT(navBarDict)

exports.config = function (req, res) {
  config.writeConfig(req.body)
  res.status(200).json({ ok: true })
}

exports.refreshLUTs = function (req, res) {
  navBarDict = searchPages()
  urlLUT = getURLLUT(navBarDict)
  res.status(200).json({ ok: true })
}


exports.getPage = function (req, res) {
  const page = req.params['0']
  const pageDict = urlLUT['/' + page]
  if (pageDict) {
    navBarDict.active = pageDict.name
    const siteName = marked.parse(fs.readFileSync('website/title' + '/page.md').toString())
    const html = marked.parse(fs.readFileSync(pageDict.path + '/page.md').toString())
    const footer = {}
    footer.left = marked.parse(fs.readFileSync('website/footer/left.md').toString())
    footer.middle = marked.parse(fs.readFileSync('website/footer/middle.md').toString())
    footer.right = marked.parse(fs.readFileSync('website/footer/right.md').toString())
    res.render('mainSite.ejs', { sitename : siteName, navBar: navBarDict, config: config, content: html , footer: footer})
  } else {
    const siteName = marked.parse(fs.readFileSync('website/title' + '/page.md').toString())
    const html = marked.parse(fs.readFileSync('website/404/page.md').toString())
    const footer = {}
    footer.left = marked.parse(fs.readFileSync('website/footer/left.md').toString())
    footer.middle = marked.parse(fs.readFileSync('website/footer/middle.md').toString())
    footer.right = marked.parse(fs.readFileSync('website/footer/right.md').toString())
    res.render('mainSite.ejs', { sitename : siteName, navBar: navBarDict, config: config, content: html , footer: footer})
  }
}

exports.settings = function (req, res) {
  res.render('settings.ejs', { config: config })
}