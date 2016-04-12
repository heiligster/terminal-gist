#!/usr/bin/env node --harmony

'use strict'

const fs = require('fs')
const program = require('commander')
const request = require('superagent')
const chalk = require('chalk')
const cfg = require('./config')
const version = '0.0.1'

/**
 * Prepare the output string
 */
const prepareOutput = (current, index) => {
  let output = '----------------------------\n'

  output += 'ID: ' + current.id + '\n'
  output += 'URL: ' + current.url + '\n'
  output += 'Description: ' + current.description + '\n'
  output += 'Public: ' + current.public + '\n'
  output += '----------------------------\n'

  console.log(output)
}

program.version(version)
program.usage('[command] [options]')

program
  .command('list')
  .description(cfg.commands.list)
  .option(cfg.username.option, cfg.username.description)
  .option(cfg.password.option, cfg.password.description)
  .action((options) => {
    if (!options.username) {
      console.log(chalk.red(cfg.messages.username))

      return
    }

    let req = request.get(cfg.endpoints.get + options.username + '/gists')

    if (options.password) {
      req.auth(options.username, options.password)
    }

    req.end((err, res) => {
      if (err) {
        console.error(chalk.red(err.status, err.message))

        return
      }

      res.body.forEach(prepareOutput)
    })
  })

program
  .command('create <file>')
  .description(cfg.commands.create)
  .option(cfg.username.option, cfg.username.description)
  .option(cfg.password.option, cfg.password.description)
  .option(cfg.info.option, cfg.info.description)
  .option(cfg.public.option, cfg.public.description)
  .action((file, options) => {
    if (!options.username) {
      console.log(chalk.red(cfg.messages.username))

      return
    }

    if (!options.password) {
      console.log(chalk.red(cfg.messages.password))

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
        .post(cfg.endpoints.post)
        .auth(options.username, options.password)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(payload))
        .end((err, res) => {
          if (err) {
            console.log(chalk.red(err))

            return
          }

          console.log(chalk.green('Gist created: ') + res.body.html_url)
        })
    })
  })

program
  .command('delete <id>')
  .description(cfg.commands.delete)
  .option(cfg.username.option, cfg.username.description)
  .option(cfg.password.option, cfg.password.description)
  .action((id, options) => {
    if (!options.username || !options.password) {
      console.error(chalk.red(cfg.messages.required))

      return
    }

    request
      .del(cfg.endpoints.delete + id)
      .auth(options.username, options.password)
      .end((err, res) => {
        if (err) {
          console.error(chalk.red(err.status, err.message))

          return
        }
        // 204 No content means all is fine
      })
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.help()
}
