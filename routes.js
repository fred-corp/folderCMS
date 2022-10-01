const express = require('express')
const router = express.Router()

const mainSiteController = require('./controllers/mainSiteController')

// redirect "/"" to "/home"
router.get('/', function (req, res) {
  res.redirect('/Home')
})

// redirect all trafic to mainsiteController.getPage
router.get('/:page', mainSiteController.getPage)

module.exports = router
