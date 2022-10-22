const baseConfig = require('../website/config/server-config.json')
const configModel = require('../models/configModel')
const sessionModel = require('../models/sessionModel')
// const mainSiteModel = require('../models/mainSiteModel')
const fs = require('fs')
const directoryTree = require('directory-tree')
const marked = require('marked')
const AdmZip = require("adm-zip")
const formidable = require('formidable')
const sanitize = require("sanitize-filename");
const passwordUtil = require('../models/passwordUtil')

// create a new configModel object
const config = new configModel(baseConfig)

const passUtil = new passwordUtil({ saltRounds: 10 })

exports.setupPage = function (req, res) {
  // check if config is set
  if (config.isSet) {
    res.redirect('/')
  } else {
    res.render('setup.ejs', { title: 'Setup', config: config, error: '' })
  }
}

exports.setupPost = function (req, res) {
  // check if config is set
  if (config.isSet) {
    res.redirect('/')
  } else {
    const form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
      // check if all fields are filled
      if (fields.username && fields.password && fields.password2 && fields.siteTitle && fields.theme) {
        // check if passwords match
        if (fields.password == fields.password2) {
          // check if theme is custom and retrieve uploaded file if it is
          if (fields.theme == 'custom') {
            if (files.themeFile) {
              // check if file is .css
              if (files.themeFile.name.split('.').pop() == 'css') {
                // check if file is less than 2MB
                if (files.themeFile.size < 2000000 && files.themeFile.size > 0) {
                  // add theme file to /public/themes folder
                  fs.renameSync(sanitize(files.themeFile.path), 'public/themes/' + sanitize(files.themeFile.name))
                  // set theme to uploaded file name
                  fields.theme = sanitize(files.themeFile.name)
                  createUser(fields)
                } else {
                  res.render('setup.ejs', { title: 'Setup', config: config, error: 'Theme file must be less than 2MB' })
                }
              } else {
                res.render('setup.ejs', { title: 'Setup', config: config, error: 'Theme file must be a .css file' })
              }
            } else {
              res.render('setup.ejs', { title: 'Setup', config: config, error: 'Theme file must be uploaded' })
            }
          }
          // check if theme exists
          else if (fs.existsSync('public/themes/' + sanitize(fields.theme))) {
            createUser(fields)
          } else {
            res.render('setup.ejs', { title: 'Setup', config: config, error: 'Theme does not exist' })
          }
        } else {
          res.render('setup.ejs', { title: 'Setup', config: config, error: 'Passwords do not match' })
        }
      } else {
        res.render('setup.ejs', { title: 'Setup', config: config, error: 'Please fill all fields' })
      }
    })
  }
}

function createUser (fields) {
  // check if username is valid
  if (fields.username.match(/^[a-zA-Z0-9]+$/)) {
    // hash password
    const passwordHash = passUtil.hashPassword(fields.password)
    // create users file
    const users = {}
    users[fields.username] = {
      name: fields.username,
      passwordHash: passwordHash,
      roles: [
        "admin"
      ]
    }
    fs.writeFileSync('secrets/users.json', JSON.stringify(users, null, 2))
    // create config file
    const config = {
      siteTitle: fields.siteTitle,
      theme: fields.theme,
      settingsURL: fields.settingsURL,
      isSet: false
    }
    fs.writeFileSync('website/config/server-config.json', JSON.stringify(config, null, 2))

    res.redirect('/setupComplete')
  }
  else {
    res.render('setup.ejs', { title: 'Setup', config: config, error: 'Username is invalid' })
  }
}

exports.setupComplete = function (req, res) {
  // check if config is set
  if (config.isSet) {
    res.redirect('/')
  } else {
    // set config to set
    config.isSet = true
    // write config to file
    config.writeConfig(config)
    // redirect to setupComplete page
    res.render('setupComplete.ejs', { title: 'Setup Complete', config: config })
  }
}
