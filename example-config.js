const serverConfig = {
  port: 3000,
  host: 'localhost'
}

const projects = {
  // your projects go here
  awesomeProject: '<id>'
}

const auth = {
  GOOGLE_CLIENT_ID: '<Client ID>',
  GOOGLE_CLIENT_KEY: '<Client Key>',
  REDIRECT_URL: 'http://localhost:3000/auth'
}

module.exports = {
  auth,
  projects,
  serverConfig
}
