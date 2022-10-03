const express = require('express')
const router = express.Router()
const config = require('./config/server-config.json')

const mainSiteController = require('./controllers/mainSiteController')

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 12, // limit each IP to 12 requests per windowMs
})

// apply rate limiter to all requests
router.use(limiter);

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
  } else if (req.params['0'] == config.refreshURL) {
    mainSiteController.refresh()
    res.send('Website LUTs refreshed ! <br> <a href="/">Go back to the website</a>')
  } else {
    mainSiteController.getPage(req, res)
  }
})

module.exports = router
