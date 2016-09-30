var eventEmitter = new require('events').EventEmitter();
var sonodaFacade = function() {};

sonodaFacade.prototype = Object.create(require('events').EventEmitter.prototype);

sonodaFacade.prototype.register = function(params) {
  var mysql      = require('mysql');
	var conf = require('./config.json');
	var connection = mysql.createConnection(conf.mysql);
	var self = this;

	connection.connect();

  var q = "insert into test_table values (0, 'asdasd');";

  connection.query(q ,function(err, rows, fields) {
    if (!err) {
      self.success({ "success" : 1});
    } else {
      self.error(err);
    }
  });

  connection.end();

}

sonodaFacade.prototype.dialognewdebt = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select * from ws_user where user_phone = "+params.user_phone+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.success({ "data" : rows[0]});
        } else {
          self.error(err);
        }
     });

    connection.end();

}

sonodaFacade.prototype.dialognewcredit = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select * from ws_user where user_phone = "+params.user_phone+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

    if (!err) {
      self.success({ "data" : rows[0]});
    } else {
      self.error(err);
    }
    });

    connection.end();

}

sonodaFacade.prototype.createnewdebt = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "insert into ws_debt (debt_user_id, credit_user_id, debt_amt, debt_desc, debt_status) values ("+params.user_id+",  "+params.to_user_id+",  "+params.amt+",  '"+params.desc+"', -1);";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.success({ "data" : { "success" : 1 }});
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

sonodaFacade.prototype.regiterMerchant = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.regiterMerchant(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.getUserDataPayment = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select * from ws_user where user_id = "+params.user_id+" limit 1;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            connection.end();
            self.success(rows);
        } else {
            console.log('error_choy' + err);
            connection.end();
            self.error(err);
        }
    });
}


sonodaFacade.prototype.registrasiTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.registrasiTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.infoSaldoTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.infoSaldoTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.inquiryBelanjaTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.inquiryBelanjaTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.requestTokenTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.requestTokenTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.topUpTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.topUpTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.transferTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.transferTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.belanjaTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.belanjaTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

sonodaFacade.prototype.gantiPINTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.gantiPINTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}

module.exports = new sonodaFacade();
