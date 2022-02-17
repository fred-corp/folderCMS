const express = require('express')
const app = express()
const routes = require('./routes')
const config = require("./server-config.json")
const fs = require('fs')
var path = require('path')

const websiteDir = config.websiteDir

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', routes)

app.listen(config.port, function () {
  console.log('server is listening on port ' + config.port)
})

function searchPages() {
  const mdFiles = getFilesFromDir("website", [".md"])
  console.log(mdFiles)
}

// function from https://www.codexpedia.com/node-js/node-js-getting-files-from-a-directory-including-sub-directories/
function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn; 
}

setInterval(searchPages, config.refreshInterval*1000)