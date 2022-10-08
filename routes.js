const express = require('express')
const router = express.Router()
const config = require('./config/server-config.json')

const mainSiteController = require('./controllers/mainSiteController')

// redirect "/"" to "/home"
router.get('/', function (req, res) {
  res.redirect('/Home')
})

// handle post request for refreshing LUTs
router.post('/' + config.settingsURL + '/reloadLUTs', mainSiteController.refreshLUTs)

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
