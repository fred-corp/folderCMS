const express = require('express')
const app = express()
const routes = require('./routes')
const config = require('./server-config.json')
const { connected } = require('process')

const websiteDir = config.websiteDir

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', routes)

app.listen(config.port, function () {
  console.log('server is listening on port ' + config.port)
})
