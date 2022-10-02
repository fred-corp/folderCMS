const express = require('express')
const app = express()
const routes = require('./routes')
const config = require('./conifg/server-config.json')
// const { connected } = require('process')

// const websiteDir = config.websiteDir

const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', routes)

app.listen(port, function () {
  console.log('server is listening on port ' + port)
})
