var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var config = require('./webpack.config')
var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))

app.use(function(req, res) {
  if ( req.originalUrl.indexOf('/css') === 0
    || req.originalUrl.indexOf('/img') === 0
  ) {
    res.sendFile(__dirname + req.originalUrl)
  } else {
    res.sendFile(__dirname + '/index.html')
  }
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==>  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})