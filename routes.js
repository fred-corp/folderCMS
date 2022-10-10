const express = require('express')
const router = express.Router()
const baseConfig = require('./website/config/server-config.json')
const configModel = require('./models/configModel')

const mainSiteController = require('./controllers/mainSiteController')

// create a new configModel object
const config = new configModel(baseConfig)

// use bodyparser
router.use(express.json())

// redirect "/"" to "/home"
router.get('/', function (req, res) {
  res.redirect('/Home')
})

// handle post requests to config update
router.post('/' + config.settingsURL + '/config', mainSiteController.config)

// handle post request for refreshing LUTs
router.post('/' + config.settingsURL + '/reloadLUTs', mainSiteController.refreshLUTs)

// handle get request for downloading website
router.get('/' + config.settingsURL + '/downloadWebsite', mainSiteController.downloadWebsite)

// redirect all URLs that are not .ico and .css files to mainsiteController.getPage
router.get('/*', function (req, res) {
  if (req.params['0'].endsWith('.ico')){
    // get only the filename from the URL
    const filename = req.params['0'].split('/').pop()
    res.sendFile(filename, { root: 'website/images' })

  } else if (req.params['0'].endsWith('.css')) {
    // get only the filename from the URL
    const filename = req.params['0'].split('/').pop()
    res.sendFile('themes/' + filename, { root: 'public' })
  } else if (req.params['0'] == config.settingsURL) {
    mainSiteController.settings(req, res)
  } else {
    mainSiteController.getPage(req, res)
  }
})

module.exports = router
