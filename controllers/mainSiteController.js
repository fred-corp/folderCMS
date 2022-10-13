const baseConfig = require('../website/config/server-config.json')
const configModel = require('../models/configModel')
const sessionModel = require('../models/sessionModel')
// const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const directoryTree = require('directory-tree')
const marked = require('marked')
const AdmZip = require("adm-zip")
const formidable = require('formidable')
const sanitize = require("sanitize-filename");

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

const cookieDebug = false

exports.settings = function (req, res) {
  const cookies = req.signedCookies
  if (!cookies) {
    if (cookieDebug) console.log('no cookies')
    res.redirect('/'+ config.settingsURL +'/login')
    return
  }

  if (cookieDebug) console.log('cookies', cookies)

  const sessionToken = cookies['session_token']
  if (!sessionToken) {
    if (cookieDebug) console.log('no session token')
    res.redirect('/'+ config.settingsURL +'/login')
    return
  }

  // read secrets/sessions.json
  const sessions = JSON.parse(fs.readFileSync('secrets/sessions.json').toString())
  if (!sessions[sessionToken]) {
    if (cookieDebug) console.log('no user session')
    res.redirect('/'+ config.settingsURL +'/login')
    return
  }
  const userSession = new sessionModel(sessions[sessionToken].username, sessions[sessionToken].expiresAt)
  if (!userSession) {
    if (cookieDebug) console.log('no user session')
    res.redirect('/'+ config.settingsURL +'/login')
    return
  }

  if (userSession.isExpired()) {
    if (cookieDebug) console.log('session expired')
    delete sessions[sessionToken]
    res.redirect('/'+ config.settingsURL +'/login')
    return
  }

  res.render('settings.ejs', { config: config })
}

const errDebug = false

exports.downloadWebsite = function (req, res) {
  const zip = new AdmZip()
  zip.addLocalFolder('website')
  // save zip to disk
  zip.writeZip('website.zip')
  res.download('website.zip', function (err) {
    if (err) {
      if (errDebug) console.log(err)
    } else {
      // delete zip file
      fs.unlink('website.zip', (err) => {
        if (err) {
          if (errDebug) console.log(err)
        }
      })
    }
  })
  res.status(200)
}

exports.uploadWebsite = function (req, res) {
  const form = new formidable.IncomingForm()
  form.uploadDir = 'uploads'
  form.parse(req, function (err, fields, files) {
    if (err) {
      if (errDebug) console.log(err)
    } else {
      if (files.websiteZip.originalFilename == 'website.zip' && files.websiteZip.mimetype == 'application/zip') {
        var oldpath = sanitize(files.websiteZip.filepath)
        oldpath = 'uploads/' + oldpath.replace('uploads', '')

        var newpath = './uploads/' + files.websiteZip.originalFilename
        
        fs.rename(oldpath, newpath, function (err) {
          if (err) {
            if (errDebug) console.log(err)
          }
          else {
            if (errDebug) console.log('File uploaded and moved!');
            const zip = new AdmZip(newpath)
            zip.extractAllTo('./newWebsite', true)
            fs.unlink(newpath, (err) => {
              if (err) {
                if (errDebug) console.log(err)
              }
              else {
                const newWebsiteFolder = fs.readdirSync('./newWebsite')
                if (newWebsiteFolder.includes('website')) {
                  const newWebsiteFolderContent = fs.readdirSync('./newWebsite/website')
                  if (newWebsiteFolderContent.includes('404') && newWebsiteFolderContent.includes('config') && newWebsiteFolderContent.includes('files') && newWebsiteFolderContent.includes('footer') && newWebsiteFolderContent.includes('images') && newWebsiteFolderContent.includes('pages') && newWebsiteFolderContent.includes('title')) {
                    // delete the old website folder
                    fs.rmSync('./website', { recursive: true })
                    // move the new website folder to the root
                    fs.renameSync('./newWebsite/website', './website')
                    // delete the new website folder
                    fs.rmSync('./newWebsite', { recursive: true })
                    // refresh the LUTs
                    navBarDict = searchPages()
                    urlLUT = getURLLUT(navBarDict)
                    // update config
                    config.readConfig()
                    res.redirect('/'+config.settingsURL)
                  } else {
                    // delete the new website folder
                    fs.rmSync('./newWebsite', { recursive: true })
                    res.status(400).json({ ok: false, error: 'Invalid website structure' })
                  }
                }
              }
            })
          }
        })
      }
    }
  })
}