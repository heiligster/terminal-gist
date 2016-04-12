#!/usr/bin/env node --harmony

'use strict'

const chalk = require('chalk')
const config = require('./config')
const endpoint = 'https://api.github.com'
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
    console.log(gist.url)
  })
}

program.version(version)

program
  .command('list')
  .description('Get a list of gists')
  .option(config.username.option, config.username.description)
  .option(config.password.option, config.password.description)
  .action((options) => {
    if (!options.username) {
      console.log(chalk.red('Please provide at least your username'))
      return
    }

    let req = request.get(endpoint + '/users/' + options.username + '/gists')

    if (options.password) {
      req.auth(options.username, options.password)
    }

    req.end((err, res) => {
      if (err) {
        console.error(chalk.red(err.status, err.message))
        return
      }

      parseResponse(res.body)
    })
  })

program
  .command('create <file>')
  .description('Create a new gist')
  .option(config.username.option, config.username.description)
  .option(config.password.option, config.password.description)
  .option(config.info.option, config.info.description)
  .option(config.public.option, config.public.description)
  .action((file, options) => {
    if (!options.username) {
      console.log(chalk.red('Please provide a username'))
      return
    }

    if (!options.password) {
      console.log(chalk.red('Please provide a password'))
      return
    }

    let payload = {
      'description': options.description || 'No descriptionn provided',
      'public': options.public,
      'files': {}
    }

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.error('Oh no! ', chalk.red(err))
        return
      }

      payload.files[file] = { 'content': data }

      request
        .post(endpoint + '/gists')
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
