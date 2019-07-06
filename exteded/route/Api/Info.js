const fs = require('fs');
const dotenv = require('dotenv').config({
  path: fs.realpathSync(__dirname + '/../../../') + '/.env',
})

module.exports = (app, express, env) => {
  app.get('/api/v1/info', (req, res) => {
    console.log();
    res.json({
      uri_camera_path: process.env.URI_CAMERA_PREFIX,
      uri_api_path: process.env.URI_API_PREFIX,
    });
  });
};
