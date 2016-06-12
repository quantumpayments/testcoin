module.exports = createApp

var debug = require('debug')('qpm_testcoin:createApp')
var express = require('express')
var session = require('express-session')
var uuid = require('node-uuid')
var cors = require('cors')
var vhost = require('vhost')
var path = require('path')
var WcMiddleware = require('wc_express').middleware
var Sequelize  = require('sequelize')
var express    = require('express')
var program    = require('commander')
var bodyParser = require('body-parser')
var https      = require('https')
var fs         = require('fs')
var wc_db      = require('wc_db');

var addMedia          = require('qpm_media').handlers.addMedia
var audio             = require('qpm_media').handlers.random_rate_audio
var balance           = require('qpm_balance').handlers.balance
var clear             = require('qpm_deposit').handlers.clear
var faucet            = require('qpm_faucet').handlers.faucet
var faucetpost        = require('qpm_faucet').handlers.faucetpost
var deposit           = require('qpm_deposit').handlers.deposit
var home              = require('./handlers/home')
var toledger          = require('qpm_deposit').handlers.toledger
var random_rate       = require('qpm_media').handlers.random_rate
var rate              = require('qpm_media').handlers.rate
var sweep             = require('qpm_deposit').handlers.sweep
var tag               = require('qpm_media').handlers.tag
var top               = require('qpm_media').handlers.top
var wallet            = require('wc_wallet').handlers.wallet
var withdrawal        = require('qpm_withdrawal').handlers.withdrawal
var withdrawalrequest = require('qpm_withdrawal').handlers.withdrawalrequest
var video             = require('qpm_media').handlers.random_rate_video



var corsSettings = cors({
  methods: [
    'OPTIONS', 'HEAD', 'GET', 'PATCH', 'POST', 'PUT', 'DELETE'
  ],
  exposedHeaders: 'User, Location, Link, Vary, Last-Modified, ETag, Accept-Patch, Updates-Via, Allow, Content-Length',
  credentials: true,
  maxAge: 1728000,
  origin: true
})

function createApp (argv, sequelize, config) {
  var app = express()

  // Session
  var sessionSettings = {
    secret: uuid.v1(),
    saveUninitialized: false,
    resave: false
  }
  sessionSettings.cookie = {
    secure: true
  }

  app.use(session(sessionSettings))
  app.use('/', WcMiddleware(corsSettings))

  app.use( bodyParser.json() )       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }))

  var config = require('../config/config')
  sequelize = wc_db.getConnection(config.db)

  debug(config)

  app.use(function(req,res, next) {
    res.locals.sequelize = sequelize
    res.locals.config = config
    next()
  })

  app.set('view engine', 'ejs')

  config.ui = config.ui || {}
  config.ui.tabs = [
    {"label" : "Home", "uri" : "/"},
    {"label" : "Balance", "uri" : "/balance"},
    {"label" : "Images", "uri" : "/random_rate"},
    {"label" : "Audio", "uri" : "/random_rate_audio"},
    {"label" : "Video", "uri" : "/random_rate_video"},
    {"label" : "Top", "uri" : "/top"},
    {"label" : "Tags", "uri" : "/tag"},
    {"label" : "Faucet", "uri" : "/faucet"},
    {"label" : "Deposit", "uri" : "/deposit"},
    {"label" : "Withdrawal", "uri" : "/withdrawal"}
  ]
  config.ui.name = "Testcoin"

  app.post('/addcredits', faucetpost)
  app.post('/addmedia', addMedia)
  app.get('/balance', balance)
  app.get('/clear', clear)
  app.get('/deposit', deposit)
  app.get('/faucet', faucet)
  app.get('/toledger', toledger)
  app.get('/random_rate', random_rate)
  app.get('/random_rate_audio', audio)
  app.get('/random_rate_video', video)
  app.all('/rate', rate)
  app.get('/sweep', sweep)
  app.all('/tag', tag)
  app.get('/top', top)
  app.get('/wallet/test', wallet)
  app.get('/withdrawal', withdrawal)
  app.post('/withdrawalrequest', withdrawalrequest)
  app.get('/', home)

  return app
}
