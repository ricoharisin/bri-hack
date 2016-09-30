var eventEmitter = new require('events').EventEmitter();
var soap = require('soap');
var sonoda = function() {};
var briUrl = 'http://hackathon.bri.co.id/BRIHackathon.asmx?wsdl';
var kodeMerchant = 80077;
var passwordMerchant = "password";
var telpNumber = '085747212167';


sonoda.prototype = Object.create(require('events').EventEmitter.prototype);

sonoda.prototype.start = function() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var self = this;
    var cfenv = require('cfenv');
    var appEnv = cfenv.getAppEnv();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(express.static('public'));

    app.get('/conf', function (req, res) {
        console.log("test %j",req.body);
        res.send(appEnv.getServices());
        //self.testcall(req.body, res);
    });

    app.get('/register', function (req, res) {
        console.log("test %j",req.body);
        self.testcall(req.body, res);
    });

    app.post('/v0/listdebt', function (req, res) {
        console.log("test %j",req.body);
        self.getlistdebt(req.body, res);
    });

    app.post('/v0/listcredit', function (req, res) {
        console.log("test %j",req.body);
        self.getlistcredit(req.body, res);
    });

    app.post('/v0/dialognewdebt', function (req, res) {
        console.log("test %j",req.body);
        self.dialognewdebt(req.body, res);
    });

    app.post('/v0/dialognewcredit', function (req, res) {
        console.log("test %j",req.body);
        self.dialognewcredit(req.body, res);
    });

    app.post('/v0/createnewdebt', function (req, res) {
        console.log("test %j",req.body);
        self.createnewdebt(req.body, res);
    })

    app.post('/v0/createnewcredit', function (req, res) {
        console.log("test %j",req.body);
        self.createnewcredit(req.body, res);
    })

    app.post('/v0/acceptdebt', function (req, res) {
        console.log("test %j",req.body);
        self.acceptdebt(req.body, res);
    })

    app.post('/v0/invite', function (req, res) {
        console.log("test %j",req.body);
        self.invitephone(req.body, res);
    })


    app.get('/v0/deposit', function (req, res) {
        console.log("test %j",req.body);
        self.deposittest(req.body, res);
    });

    app.get('/v0/bri/testquery', function(req, res) {
        console.log("req %j", req.body);
        self.getUserDataPayment(req.body, res);
    });

    app.post('/v0/bri/merchant/register', function(req, res) {
        console.log("req %j", req.body);
        self.regiterMerchant(req.body, res);
    });
    app.post('/v0/bri/tbank/register', function(req, res) {
        console.log("req %j", req.body);
        self.registrasiTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/saldo', function(req, res) {
        self.infoSaldoTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/token', function(req, res) {
        console.log("request parames : %j", req.body);
        self.requestTokenTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/topup', function(req, res) {
        console.log("req %j", req.body);
        self.infoSaldoTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/transfer', function(req, res) {

        console.log("req %j", req.body);
        self.transferTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/belanja', function(req, res) {
        console.log("req %j", req.body);
        self.belanjaTBank(req.body, res);
    });

    app.post('/v0/bri/tbank/ganti', function(req, res) {
        console.log("req %j", req.body);
        self.gantiPINTBank(req.body, res);
    });

    app.post('/v0/login', function (req, res) {
        console.log("test %j",req.body);
        self.loginUser(req.body, res);
    });

    app.post('/v0/register', function (req, res) {
        console.log("test %j",req.body);
        self.register(req.body, res);
    });

    app.post('/v0/bri/tbank/ganti', function(req, res) {
        console.log("req %j", req.body);
        self.gantiPINTBank(req.body, res);
    });

    app.post('/v0/fcm', function(req, res) {
        console.log("req %j", req.body);
        self.updateGcm(req.body, res);
    });
    
    
    app.listen(appEnv.port, '0.0.0.0', function() {

      console.log("server starting on " + appEnv.url);

      return;
    });

    return;
}

sonoda.prototype.testcall = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err){
                return callback(err, null);
            });

            sonodaFacade.register(query);
        }
    ], function(err, result) {
        if (err) return res.status(500).json(err);

        return res.json(result);
    });

    return;
}

sonoda.prototype.invitephone = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    var https = require('https');

    var data = JSON.stringify({
     api_key: '0ebda697',
     api_secret: '5bd410c755fc3f7a',
     to: params.user_phone,
     from: '080989999',
     text: 'Hi temanmu mengundang ke LendMoney untuk mencatat hutang! silahkan kunjungi http://hack-bri-dev.mybluemix.net/register.html'
    });

    var options = {
     host: 'rest.nexmo.com',
     path: '/sms/json',
     port: 443,
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Content-Length': Buffer.byteLength(data)
     }
    };

    var req = https.request(options);

    req.write(data);
    req.end();

    self.responseGeneration(res, null, {"success" : 1});
}

sonoda.prototype.acceptdebt = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "update ws_debt set debt_status = 1 where debt_id="+params.debt_id+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.responseGeneration(res, null, {"success" : 1});
        } else {
          self.responseGenerationError(res, err);
        }

        connection.destroy();
     });
}

sonoda.prototype.getlistdebt = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "select ws_debt.debt_id AS 'debt_id', ws_debt.debt_amt AS 'debt_amt',"+ 
            "ws_debt.debt_desc AS 'debt_desc', ws_debt.debt_status AS 'status', " +
            "ws_user.user_id, ws_user.user_name, ws_user.user_img" +
            " From ws_debt" +
            " INNER JOIN ws_user" +
            " ON ws_debt.debt_user_id = "+params.user_id+" AND ws_user.user_id = ws_debt.credit_user_id;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.responseGeneration(res, null, rows);
        } else {
            console.log(err);
          self.responseGenerationError(res, err);
        }

        connection.destroy();
     });
}

sonoda.prototype.getlistcredit = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "select ws_debt.debt_id AS 'credit_id', ws_debt.debt_amt AS 'credit_amt',"+ 
            "ws_debt.debt_desc AS 'credit_desc', ws_debt.debt_status AS 'status', " +
            "ws_user.user_id, ws_user.user_name, ws_user.user_img" +
            " From ws_debt" +
            " INNER JOIN ws_user" +
            " ON ws_debt.credit_user_id = "+params.user_id+" AND ws_user.user_id = ws_debt.debt_user_id;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.responseGeneration(res, null, rows);
        } else {
            console.log(err);
          self.responseGenerationError(res, err);
        }

        connection.destroy();
     });
}

sonoda.prototype.dialognewdebt = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "select * from ws_user where user_phone = "+params.user_phone+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.responseGeneration(res, null, rows[0]);
        } else {
          self.responseGenerationError(res, err);
        }

        connection.destroy();
     });
}


sonoda.prototype.dialognewcredit = function(query, res) {
    //call function here to facade
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "select * from ws_user where user_phone = "+params.user_phone+";";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log(rows);

        if (!err) {
          self.responseGeneration(res, null, rows[0]);
        } else {
          self.responseGenerationError(res, err);
        }
        connection.destroy();
    });

    
}

sonoda.prototype.createnewdebt = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "insert into ws_debt (debt_user_id, credit_user_id, debt_amt, debt_desc, debt_status) values ("+params.user_id+",  "+params.to_user_id+",  "+params.amt+",  '"+params.desc+"', -1);";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.responseGeneration(res, null, {"success" : 1});
        } else {
          self.responseGenerationError(res, err);
        }

        connection.destroy();
    }); 
}

sonoda.prototype.createnewcredit = function(query, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "insert into ws_debt (debt_user_id, credit_user_id, debt_amt, debt_desc, debt_status) values ("+params.to_user_id+",  "+params.user_id+",  "+params.amt+",  '"+params.desc+"', -1);";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.responseGeneration(res, null, {"success" : 1});
        } else {
          self.responseGenerationError(res, err);
        }

        connection.destroy();
    }); 
}

sonoda.prototype.listdebttest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./listdebt.json");

    res.json(listdebtjson);

    return;
}

sonoda.prototype.listcredittest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./listcredit.json");

    res.json(listdebtjson);

    return;
}

sonoda.prototype.deposittest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./deposit.json");

    res.json(listdebtjson);

    return;
}

sonoda.prototype.responseGeneration = function(res, err, result){
    if (err) {
        var response = {
            success : '0',
            data : '{}',
            message : err
        };
        return res.status(500).json(response);
    } else {
        var response = {
                    success : '1',
                    data : result,
                    message : "success"
                };
        return res.json(response);
    }
}

sonoda.prototype.responseGenerationError = function(res, message){
    
    var response = {
        success : '0',
        message : message
    };
    return res.status(500).json(response);
}

sonoda.prototype.updateGcm = function(query, res) {
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;
    var params = query;

    connection.connect();

    var q = "update ws_user set user_fcm = '" + params.user_fcm+"' where user_id  = '" + params.to_user_id+"';";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
          self.responseGeneration(res, null, {"success" : 1});
        } else {
          self.responseGenerationError(res, err);
        }

        connection.destroy();
    }); 
}

sonoda.prototype.regiterMerchant = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.regiterMerchant(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.getUserDataPayment = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.getUserDataPayment(params);
        }
    ], function(err, result) {
        var user = result[0];
        return user;
    });

    return;
}

sonoda.prototype.loginUser = function(params, res) {
    var self = this;
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);

    connection.connect();

    var q = "select * from ws_user where user_phone = '" + params.user_phone +"' and user_password = '" + params.user_password +"' limit 1;";

    console.log(q);

    connection.query(q ,function(err, result, fields) {
        connection.end();
        if (!err) {
            if (result.length > 0) {
                var user = result[0];
                self.responseGeneration(res, err, result);
            } else {
                self.responseGenerationError(res, err);
            }
        } else {
            self.responseGenerationError(res, err);
        }
    });
    return;
}

sonoda.prototype.register = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var self = this;
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "insert into ws_user(user_name, user_email, user_password, user_phone, user_ktp) " + 
        "values ('" + params.user_name +"', '" + params.user_email +"', '" + params.user_password + "' " +
        ", '" + params.user_phone + "', '" + params.user_ktp + "' );";

    connection.query(q ,function(err, rows, fields) {
        connection.end();
        if (!err) {
          self.responseGeneration(res, err, { "success" : 1});
        } else {
          self.responseGenerationError(res, err);
        }
    });
    return;
}

sonoda.prototype.registrasiTBank = function(params, res) {
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    var q = "select * from ws_user where user_id = "+ params.user_id +" limit 1;";

    console.log(q);

    connection.connect();
    
    connection.query(q ,function(err, rows, fields) {
        console.log(rows);
        if (!err) {
            if (rows.length == 0) {
                connection.end();
                return res.status(500).json(err);
            }

            var user = rows[0];

            var newParams = {
                kodeMerchant : kodeMerchant,
                password : user.user_password,
                nohandphone : user.user_phone,
                nama : user.user_name,
                noktp : user.user_ktp,
                tempatLahir : "Bogor",
                tanggalLahir : "29091995",
                alamat : "Wisma 77",
                kota : "Purwokerto",
                email : user.user_email,
                pekerjaan : "Tukang Ketik"
            }
            console.log(newParams);

            soap.createClient(briUrl, function(err, client) {
                client.RegistrasiTBank(newParams, function(err, result) {
                    if (err) {
                        connection.end();
                        return res.status(500).json(err);
                    } else {
                        console.log(result);
                        var response = JSON.parse(result.RegistrasiTBankResult);
                        if (response.ResponseCode != "00") {
                            return res.status(500).json(err);
                        }
                        user.user_pin = response.PinNasabah;

                        var q = "update ws_user " + 
                            "set user_name = '" + user.user_name +"', user_email = '" + user.user_email +"', user_password='" + user.user_password + "' " +
                            ", user_phone='" + user.user_phone + "', user_ktp='" + user.user_ktp + "', user_pin='" + user.user_pin + "' " +
                            "where user_id = '" + user.user_id + "';";
                        console.log(q);

                        connection.query(q ,function(err, rows, fields) {
                            console.log(rows);
                            if (!err) {
                                connection.end();
                                self.responseGeneration(res, err, user);
                                return;
                            } else {
                                connection.end();
                                return res.status(500).json(err);
                            }
                            
                        });
                    }
                });
            });

        } else {
            connection.end();
            return res.status(500).json(err);
        }
    });
}

sonoda.prototype.infoSaldoTBank = function(params, res) {
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
            var user = rows[0];

            var newParams = {
                nohandphone : user.user_phone,
                pin : user.user_pin
            }
            soap.createClient(briUrl, function(err, client) {
                client.InfoSaldoTBank(newParams, function(err, result) {
                    if (err) {
                        console.log("error infoSaldoTBank");
                        self.responseGenerationError(res, err);
                    } else {
                        var response = JSON.parse(result.InfoSaldoTBankResult);
                        if (err) {
                            return res.status(500).json(err);
                        }

                        if (response.ResponseCode != "00") {
                            return self.responseGenerationError(res, response.ResponseDescription);
                        }

                        var newResponse = {
                            "saldo" : response.Saldo
                        }

                        self.responseGeneration(res, err, newResponse);
                    }
                });
            });
        } else {
            connection.end();
            self.responseGenerationError(res, err);
        }
    });
    return;
}

sonoda.prototype.inquiryBelanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.inquiryBelanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.requestTokenTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var self = this;

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.getUserDataPayment(params);
        }
    ], function(err, result) {
        console.log("masuk 1", result);
        if (err) {
            return res.status(500).json(err);
        }
        var user = result[0];

        var newParams = {
            nohandphone : user.user_phone,
            pin : user.user_pin
        }

        asyncTask.waterfall([
            function(callback) {
                sonodaFacade.on("successSecond", function(response) {
                    return callback(null, response);
                });

                sonodaFacade.on("errorSecond", function(err) {
                    return callback(err, null);
                });

                sonodaFacade.requestTokenTBank(newParams);
            }
        ], function(err, result) {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.ResponseCode != "00") {
                return self.responseGenerationError(res, result.ResponseDescription);
            }

            var newResponse = {
                "token" : result.Token
            }
            console.log("token " + result.Token);
            self.responseGeneration(res, err, newResponse);
            return;
        });        
        return;
    });


    

    return;
}

sonoda.prototype.topUpTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": null,
                  "Token": null,
                  "Nama": null
                }*/
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.topUpTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.transferTBank = function(params, res) {
    var mysql      = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var debtParam = {
        'debt_id' : params.debt_id
    };

    var q = "select d.*, d.debt_amt as nominal, a.user_phone as pengirim, b.user_phone as penerima, a.user_pin as pin from ws_debt d " +
        "join ws_user a on d.debt_user_id = a.user_id " + 
        "join ws_user b on d.credit_user_id = b.user_id where debt_id = "+ debtParam.debt_id +" and debt_status = '1' limit 1;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        if (!err) {
            if (rows.length > 0) {
                var debt = rows[0];
                var transferParams = {
                    nohandphonePengirim : debt.pengirim,
                    nohandphonePenerima : debt.penerima,
                    pin : debt.pin,
                    nominal : debt.nominal
                };
                soap.createClient(briUrl, function(err, client) {
                    client.TransferTBank(transferParams, function(err, result) {
                        if (err) {
                            connection.end();
                            return res.status(500).json(err);
                        } else {

                            var response = JSON.parse(result.TransferTBankResult);
                            if (response.ResponseCode != "00") {
                                connection.end();
                                return self.responseGenerationError(res, response.ResponseDescription);
                            }
                            var updateParam = {
                                debt_id : debt.debt_id,
                                debt_status : '0'
                            }
                            var q = "update ws_debt set debt_status = '" + updateParam.debt_status +"' where debt_id = "+ updateParam.debt_id +";";

                            connection.query(q ,function(err, rows, fields) {
                                if (!err) {
                                    connection.end();
                                    self.responseGeneration(res, err, rows);
                                } else {
                                    connection.end();
                                    self.responseGenerationError(res, err);
                                }
                                return;
                            });
                        }
                    });
                });
            } else {
                connection.end();
                return self.responseGenerationError(res, err);
            }
        } else {
            connection.end();
            return self.responseGenerationError(res, err);
        }
    });
}


sonoda.prototype.belanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "1999000.00",
                  "Token": null,
                  "Nama": null
                }*/
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.belanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.gantiPINTBank = function(params) {
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "1999000.00",
                  "Token": null,
                  "Nama": null
                }*/
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.gantiPINTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.responseGeneration = function(res, err, result){
    if (err) {
        var response = {
            success : '0',
            data : '{}',
            message : err
        };
        return res.status(500).json(response);
    } else {
        var response = {
                    success : '0',
                    data : result,
                    message : "success"
                };
        return res.json(response);
    }
}

sonoda.prototype.regiterMerchant = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.regiterMerchant(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}


sonoda.prototype.inquiryBelanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.inquiryBelanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.requestTokenTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.requestTokenTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.topUpTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.topUpTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.transferTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.transferTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}


sonoda.prototype.belanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.belanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.gantiPINTBank = function(params) {
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


module.exports = new sonoda();
