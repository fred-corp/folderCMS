const express = require('express')
const app = express()

const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.get('/', function(req, res) {res.status(200).send('<h1>Hey!</h1>')})

app.listen(port, function () {
  console.log('server is listening on port ' + port)
})
