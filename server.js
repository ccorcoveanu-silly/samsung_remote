const express = require('express')
const bodyParser = require('body-parser')
const tv = require('./src/tv.js')
const app = express()

app.use(bodyParser.json())

app.get('/', function(req, res) {
  const _tv = tv({ ip: '192.168.1.14' })

  _tv.send('KEY_VOLUP', function callback(err) {
    if (err) {
      throw new Error(err);
    } else {
      // command has been successfully transmitted to your tv
      console.log('mere baaaa')
    }
  });


  /*const _res = _tv.isAlive(function(err) {
    if (err) {
      throw new Error('TV is offline');
    } else {
      console.log('TV is ALIVE!');
    }

    return err
  })

  console.log(_res)*/

  res.send('sent')
})

const port = 3000
app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==>  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})