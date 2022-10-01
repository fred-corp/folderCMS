const express = require('express')
const router = express.Router()
const config = require('./server-config.json')

const mainSiteController = require('./controllers/mainSiteController')

// redirect "/"" to "/home"
router.get('/', function (req, res) {
  res.redirect('/Home')
})

// redirect all URLs that are not .ico and .css files to mainsiteController.getPage
router.get('/*', function (req, res) {
  if (req.params['0'].endsWith('.ico')){
    // get only the filename from the URL
    const filename = req.params['0'].split('/').pop()
    res.sendFile(filename, { root: config.websiteDir+'/images' })

  } else if (req.params['0'].endsWith('.css')) {
    // get only the filename from the URL
    const filename = req.params['0'].split('/').pop()
    res.sendFile('themes/' + filename, { root: 'public' })
  } else {
    mainSiteController.getPage(req, res)
  }
})

module.exports = router
