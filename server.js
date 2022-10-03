const express = require('express')
const app = express()
const routes = require('./routes')
const config = require('./config/server-config.json')
// const { connected } = require('process')

// const websiteDir = config.websiteDir

// set up rate limiter: maximum of five requests per minute
const RateLimit = require('express-rate-limit')


// apply rate limiter to all requests
app.use(RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 240, // limit each IP to 240 requests per windowMs
}))

const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', routes)

app.listen(port, function () {
  console.log('server is listening on port ' + port)
})
