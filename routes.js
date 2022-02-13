const express = require('express')
const router = express.Router()

const mainSiteController = require('./controllers/mainSiteController')

router.get('/', mainSiteController.homePage)

module.exports = router
