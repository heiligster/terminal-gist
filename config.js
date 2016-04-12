'use strict'

module.exports = {
  'endpoints': {
    'get': 'https://api.github.com/users/',
    'post': 'https://api.github.com/gists/',
    'put': '',
    'delete': ''
  },
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
