var convict = require('convict');

var config = convict({
  email: {
    doc: 'default contact email',
    format: String,
    default: 'info@mintitmedia.com'
  },
  ipaddress: {
    doc: 'IP the application runs on',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'OPENSHIFT_NODEJS_IP'
  },
  port: {
    doc: 'Port the application listens on',
    format: 'port',
    default: '3030',
    env: 'OPENSHIFT_NODEJS_PORT'
  },
  sendgrid: {
    doc: 'Sendrid API KEY',
    format: String,
    default: '',
    env: 'SENDGRID_API_KEY'
  },
  apiUrl: {
    doc: 'API URL',
    format: String,
    default: '',
    env: 'API_URL'
  },
});

config.validate();

module.exports = config;
