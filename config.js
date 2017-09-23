const convict = require('convict');

const config = convict({
  email: {
    doc: 'default contact email',
    format: String,
    default: 'info@mintitmedia.com',
    env: 'CONTACT_EMAIL',
  },
  ipaddress: {
    doc: 'IP the application runs on',
    format: 'ipaddress',
    default: '0.0.0.0',
  },
  port: {
    doc: 'Port the application listens on',
    format: 'port',
    default: '3072',
  },
  sendgrid: {
    doc: 'Sendrid API KEY',
    format: String,
    default: '',
    env: 'SENDGRID_API_KEY',
  },
  apiUrl: {
    doc: 'API URL',
    format: String,
    default: '',
    env: 'API_URL',
  },
});

config.validate();

module.exports = config;
