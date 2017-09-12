var Busboy = require('busboy');
var fs = require('fs');
var fse = require('fs-extra');
var os = require('os');
var path = require('path');
var snowflake = require('node-snowflake').Snowflake;
var qn = require('qn');
var uploadimg = function (static_url, config = {}, handel) {
  return function (req, res, next) {
    var _respond = respond(static_url, config, handel);
    _respond(req, res, next);
  };
};


var respond = function (static_url, config = {}, callback) {
  if (typeof config === 'function') {
    callback = config
  }
  return function (req, res, next) {
    if (req.query.action === 'config') {
      callback(req, res, next);
      return;
    } else if (req.query.action === 'uploadimage') {
      var busboy = new Busboy({
        headers: req.headers
      });
      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

        res.ue_up = function (img_url) {
          var tmpdir = path.join(os.tmpdir(), path.basename(filename));
          var name = snowflake.nextId() + path.extname(tmpdir);
          var client = {};
          if (config.qn) {
            client = qn.create(config.qn);
            client.upload(file, {
              key: 'ueditor/images/' + name
            }, function (err, results) {
              if (err) throw err;
              res.json({
                'url': results.url,
                'title': req.body.pictitle,
                'original': filename,
                'state': 'SUCCESS'
              });
            });
            return false
          }
          
        };
        callback(req, res, next);
      });
      req.pipe(busboy);
    } else {
      callback(req, res, next);
    }
    return;
  };
};
module.exports = uploadimg;