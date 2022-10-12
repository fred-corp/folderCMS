const baseConfig = require('../website/config/server-config.json')
const configModel = require('../models/configModel')
const sessionModel = require('../models/sessionModel')
const passwordUtil = require('../models/passwordUtil')
const fs = require('fs')
const uuid = require('uuid')

const passUtil = new passwordUtil({ saltRounds: 10 })

const sessions = {}
var users = {}

// create a new configModel object
const config = new configModel(baseConfig)

exports.loginPage = function (req, res) {
  // read users file at login
  users = JSON.parse(fs.readFileSync('secrets/users.json').toString())
  res.render('login.ejs', { title: 'Login', config: config, error: '' })
}

exports.loginPost = function (req, res) {
  console.log(req.body)
  const username = req.body.username
  const password = req.body.password

  // check if user exists
  if (users[username]) {
    user = users[username]
    // compare if password corresponds with hash
    if (passUtil.comparePassword(password, user.passwordHash)) {
      // create a new session
      const sessionToken = uuid.v4()
      const now = new Date()
      const maxTime = 10 * 60 * 1000 // 10 minutes
      const expiresAt = new Date(+now + maxTime) // ten minutes from now
      const session = new sessionModel(username, expiresAt)
      // save session to sessions object
      sessions[sessionToken] = session
      // save sessions to sessions .json file at secrets
      fs.writeFileSync('secrets/sessions.json', JSON.stringify(sessions, null, 2))

      console.log(sessions)
      // set cookie
      res.cookie("session_token", sessionToken, { expires: expiresAt })

      res.redirect('/' + config.settingsURL)
    } else {
      res.render('login.ejs', { title: 'Login', config: config, error: 'Incorrect password' })
    }
  } else {
    res.render('login.ejs', { title: 'Login', config: config, error: 'User does not exist' })
  }
}
