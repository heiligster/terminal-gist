'use strict'

module.exports = {
  'commands': {
    'list': 'Get gists',
    'create': 'Create a gist',
    'delete': 'Delete a gist'
  },
  'endpoints': {
    'get': 'https://api.github.com/users/',
    'post': 'https://api.github.com/gists',
    'put': '',
    'delete': 'https://api.github.com/gists/'
  },
  'messages': {
    'username': 'Please provide a username',
    'password': 'Please provide a password',
    'required': 'Please provide username and password'
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
