'use strict'

module.exports = {
  'username': {
    option: '-u, --username <username>',
    description: 'Username for authentication'
  },
  'password': {
    option: '-p, --password <password>',
    description: 'Password for authentication'
  },
  'info': {
    option: '-d --description <descr>',
    description: 'Info about this gist'
  },
  'public': {
    option: '--public <public>',
    description: 'Whether the gist should be public'
  }
}
