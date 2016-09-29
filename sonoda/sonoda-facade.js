var eventEmitter = new require('events').EventEmitter();
var sonodaFacade = function() {};

sonodaFacade.prototype = Object.create(require('events').EventEmitter.prototype);

sonodaFacade.prototype.register = function(params) {
  var mysql      = require('mysql');
	var conf = require('./config.json');
	var connection = mysql.createConnection(conf.mysql);
	var self = this;

	connection.connect();

  var q = "insert into ws_personal_user values ("+params.user_id+", 0, 0, 0, 0, 0);";

  connection.query(q ,function(err, rows, fields) {
    if (!err) {
      self.success({ "success" : 1});
    } else {
      self.error(err);
    }
  });

  connection.end();

}

sonodaFacade.prototype.impressionProduct = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var fieldName = 'dep_'+params.dep_id;

    connection.connect();

    var q = "select "+fieldName+" from ws_personal_user where user_id = "+params.user_id+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            var score = rows[0][fieldName];
            score = score + 1;

            var q = "update ws_personal_user set "+fieldName+" = "+score+" where user_id = "+params.user_id+";";
            console.log(q);
            connection.query(q ,function(err, rows, fields) {
                if (!err) {
                    self.success({ "success" : 1});
                } else {
                    self.error(err);
                }
            });
            connection.end();
        } else {
            connection.end();
            self.error(err);
        }
    });


}

sonodaFacade.prototype.clickProduct = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var fieldName = 'dep_'+params.dep_id;

    connection.connect();

    var q = "select "+fieldName+" from ws_personal_user where user_id = "+params.user_id+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            var score = rows[0][fieldName];
            score = score + 10;

            var q = "update ws_personal_user set "+fieldName+" = "+score+" where user_id = "+params.user_id+";";
            console.log(q);
            connection.query(q ,function(err, rows, fields) {
                if (!err) {
                    self.success({ "success" : 1});
                } else {
                    self.error(err);
                }
            });
            connection.end();
        } else {
            connection.end();
            self.error(err);
        }
    });


}

sonodaFacade.prototype.getProductList = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.getUserPersonalDepartment(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });
}

sonodaFacade.prototype.success = function(res) {
  console.log('success!  '+res);
  this.emit('success', res);
  return;
}

sonodaFacade.prototype.error = function(err) {
  console.log('error '+err);
  this.emit('error', err);
  return;
}

module.exports = new sonodaFacade();
