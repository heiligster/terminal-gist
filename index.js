#!/usr/bin/env node --harmony

'use strict'

const chalk = require('chalk')
const endpoint = 'https://api.github.com/gists'
const fs = require('fs')
const program = require('commander')
const request = require('superagent')
const version = '0.0.1'

/**
 * Handle response from api calls
 */
const handleResponse = (err, res) => {
  if (err) {
    console.log(chalk.red(err))
    return
  }

  console.log(chalk.green('Gist created: ') + res.body.html_url)
}

/**
 * Parse response from api call
 */
const parseResponse = (res) => {
  res.forEach(function (gist) {
  })
}

program.version(version)

program
  .command('list')
  .description('Get a list of gists')
  .option('-u, --username <username>', 'Specify username to use to authenticate')
  .option('-p, --password <password>', 'Specify password to use to authenticate')
  .action(function (options) {
    if (!options.username) {
      console.log(chalk.red('Please provide at least your username'))
      return
    }

    request
      .get('https://api.github.com/users/' + options.username + '/gists')
      .end(function (err, res) {
        if (err) {
          return
        }

        parseResponse(res.body)
      })
  })

program
  .command('create <file>')
  .description('Create a new gist')
  .option('-u, --username <username>', 'Specify username to use to authenticate')
  .option('-p, --password <password>', 'Specify password to use to authenticate')
  .option('-d, --description <descr>', 'Short description for this gist')
  .option('-p, --public <public>', 'Wheter the gist should be public')
  .action(function (file, options) {
    if (!options.username) {
      console.log(chalk.red('Please provide a username'))
      return
    }

    if (!options.password) {
      console.log(chalk.red('Please provide a password'))
      return
    }

    let payload = {
      'description': program.description || 'No descriptionn provided',
      'public': program.public || false,
      'files': {}
    }

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.error('Oh no! ', chalk.red(err))
        return
      }

      payload.files[file] = { 'content': data }

      request
        .post(endpoint)
        .auth(options.username, options.password)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(payload))
        .end(handleResponse)
    })
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.help()
}
