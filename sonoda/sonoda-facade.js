var eventEmitter = new require('events').EventEmitter();
var sonodaFacade = function() {};

sonodaFacade.prototype = Object.create(require('events').EventEmitter.prototype);

sonodaFacade.prototype.register = function(params) {
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "insert into ws_user(user_name, user_email, user_password, user_phone, user_ktp) " + 
        "values ('" + params.user_name +"', '" + params.user_email +"', '" + params.user_password + "' " +
        ", '" + params.user_phone + "', '" + params.user_ktp + "' );";

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.success({ "success" : 1});
        } else {
          self.error(err);
        }
        connection.end();
    });
}

sonodaFacade.prototype.updateUser = function(params) {
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "update ws_user(user_name, user_email, user_password, user_phone, user_ktp, user_pin) " + 
        "values ('" + params.user_name +"', '" + params.user_email +"', '" + params.user_password + "' " +
        ", '" + params.user_phone + "', '" + params.user_ktp + "', '" + params.user_pin + "' " +
        "where user_id = '" + params.user_id + "');";

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.success({ "success" : 1});
        } else {
          self.error(err);
        }
        connection.end();
    });
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
    var pool = mysql.createPool(conf.mysql);
    var self = this;

    pool.getConnection(function(err, connection) {
        var q = "select * from ws_user where user_phone = "+params.user_phone+";";
        console.log(q);
        connection.query(q ,function(err, rows, fields) {
            connection.release();
            console.log(rows);

            if (!err) {
              self.success({ "data" : rows[0]});
            } else {
              self.error(err);
            }
        });
    });

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


sonodaFacade.prototype.successSecond = function(res) {
  console.log('successSecond!  '+res);
  this.emit('successSecond', res);
  return;
}

sonodaFacade.prototype.errorSecond = function(err) {
  console.log('errorSecond '+err);
  this.emit('errorSecond', err);
  return;
}

sonodaFacade.prototype.successThree = function(res) {
  console.log('successThree!  '+res);
  this.emit('successThree', res);
  return;
}

sonodaFacade.prototype.errorThree = function(err) {
  console.log('errorThree '+err);
  this.emit('errorThree', err);
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

    var q = "select * from ws_user where user_id = "+ params.user_id +" limit 1;";

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

sonodaFacade.prototype.login = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select * from ws_user where user_phone = '" + params.user_phone +"' and user_password = '" + params.user_password +"' limit 1;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            if (rows.length > 0) {
                self.success(rows);
            } else {
                self.error(rows);
            }
            connection.end();
        } else {
            connection.end();
            self.error(err);
        }
    });
}

sonodaFacade.prototype.getDebtDataPayment = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select d.*, d.debt_amt as nominal, a.user_phone as pengirim, b.user_phone as penerima, a.user_pin as pin from ws_debt d " +
        "join ws_user a on d.debt_user_id = a.user_id " + 
        "join ws_user b on d.credit_user_id = b.user_id where debt_id = "+ params.debt_id +" and debt_status = '-1' limit 1;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            if (rows.length > 0) {
                self.success(rows);
            } else {
                self.error(rows);
            }
            connection.end();
            
        } else {
            console.log('error_choy' + err);
            connection.end();
            self.error(err);
        }
    });
}

sonodaFacade.prototype.updataStatusDebt = function(params) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "update ws_debt set debt_status = '" + params.debt_status +"' where debt_id = "+ params.debt_id +";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            connection.end();
            self.successThree(rows);
        } else {
            connection.end();
            self.errorThree(err);
        }
    });
}

sonodaFacade.prototype.getUserDataPaymentSecond = function(params) {
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
            self.successSecond(rows);
        } else {
            console.log('error_choy' + err);
            connection.end();
            self.errorSecond(err);
        }
    });
}


sonodaFacade.prototype.registrasiTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.registrasiTBank(params);

    sonodaCore.on("success", function(response) {
        self.successSecond(response);
    });

    sonodaCore.on("error", function(err) {
        self.errorSecond(err);
    });
}

sonodaFacade.prototype.infoSaldoTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.infoSaldoTBank(params);

    sonodaCore.on("success", function(response) {
        self.successSecond(response);
    });

    sonodaCore.on("error", function(err) {
        self.errorSecond(err);
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
    console.log("request Token");
    console.log(params);

    sonodaCore.on("success", function(response) {
        self.successSecond(response);
    });

    sonodaCore.on("error", function(err) {
        self.successSecond(err);
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
        self.successSecond(response);
    });

    sonodaCore.on("error", function(err) {
        self.errorSecond(err);
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
