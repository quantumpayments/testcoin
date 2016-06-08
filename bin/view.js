#!/usr/bin/env node

// requires
var child_process = require('child_process')
var fs            = require('fs')
var program       = require('commander')
var qpm_media     = require('qpm_media')
var request       = require('request')





/**
* version as a command
*/
function bin(argv) {
  // setup config


  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  var url     = process.argv[2] || 'https://localhost:3000/random_rate'
  var cert    = process.env['CERT']
  var display = process.env['DISP'] || 'display'

  var options = {
    url: url,
    key: fs.readFileSync('/home/melvin/s/webid.pem'),
    cert: fs.readFileSync('/home/melvin/s/webid.pem'),
    headers: { //We can define headers too
      'Accept': 'application/json'
    }
  }


  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      json = JSON.parse(body)
      var uri = json.uri
      var cacheURI = json.cacheURI
      var displayURI = cacheURI || uri
      console.log(json.rating)
      console.log(displayURI)

      var cmd = display + ' ' + displayURI
      child_process.exec(cmd)

    } else {
      console.error(error);
    }

  })
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv)
}

module.exports = bin
