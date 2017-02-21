'use strict'

const { projects, auth, serverConfig } = require('./config.js')

const Hapi = require('hapi')
const Good = require('good')

const google = require('googleapis')
const OAuth2 = google.auth.OAuth2

const analytics = google.analytics('v3')

const oauth2Client = new OAuth2(
  auth.GOOGLE_CLIENT_ID,
  auth.GOOGLE_CLIENT_KEY,
  auth.REDIRECT_URL
)

google.options({
  auth: oauth2Client
})

const server = new Hapi.Server()

server.connection({
  port: serverConfig.port,
  host: serverConfig.host
})

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, err => {
  if (err) throw err

  server.start(err => {
    if (err) throw err

    server.log('info', 'Server running at: ' + server.info.uri)
  })
})

server.register(require('inert'), err => {
  if (err) throw err

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      if (oauth2Client.credentials.access_token) {
        reply.file('client/dist/index.html')
      } else {
        reply().redirect('/auth')
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/api/analytics/{project}',
    handler: function (request, reply) {
      if (oauth2Client.credentials.access_token) {
        analytics.data.realtime.get({
          ids: `ga:${projects[request.params.project]}`,
          metrics: 'rt:activeUsers',
          dimensions: 'rt:browser,rt:operatingSystem,rt:country,rt:deviceCategory'
        }, function (err, res) {
          if (err) throw err

          reply(res)
            .type('application/json')
        })
      } else {
        reply().redirect('/auth')
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/auth',
    handler: function (request, reply) {
      const { code } = request.query

      if (oauth2Client.credentials.access_token) {
        reply().redirect('/')
        return
      }

      if (code) {
        oauth2Client.getToken(code, function (err, tokens) {
          // Now tokens contains an access_token and an optional refresh_token. Save them.
          if (!err) {
            oauth2Client.setCredentials(tokens)
          }
        })
        return reply().redirect('/')
      }

      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: 'https://www.googleapis.com/auth/analytics.readonly'

      // Optional property that passes state parameters to redirect URI
      // state: { foo: 'bar' }
      })

      reply().redirect(url)
    }
  })

  server.route({
    method: '*',
    path: '/{path*}', // catch-all path
    handler: {
      directory: {
        path: 'client/dist'
      }
    }
  })
})
