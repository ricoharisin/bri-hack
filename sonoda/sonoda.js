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

    app.get('/conf', function (req, res) {
        console.log("test %j",req.body);
        res.send(appEnv.getServices());
        //self.testcall(req.body, res);
    });

    app.get('/register', function (req, res) {
        console.log("test %j",req.body);
        self.testcall(req.body, res);
    });

    app.get('/v0/listdebt', function (req, res) {
        console.log("test %j",req.body);
        self.listdebttest(req.body, res);
    });

    app.get('/v0/listcredit', function (req, res) {
        console.log("test %j",req.body);
        self.listcredittest(req.body, res);
    });

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
        self.topUpTBank(req.body, res);
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
    
    
    app.listen(appEnv.port, '0.0.0.0', function() {

      console.log("server starting on " + appEnv.url);
    });
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

sonoda.prototype.regiterMerchant = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": "80077",
                  "Password": "password",
                  "PinNasabah": null,
                  "Saldo": null,
                  "Token": null,
                  "Nama": "ARM Teadm"
                }*/
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

            sonodaFacade.login(params);
        }
    ], function(err, result) {
        if (err) 
        {
            return res.status(500).json(err);
        }

        var user = result[0];
        self.responseGeneration(res, err, result);

        return;
    });

    return;
}

sonoda.prototype.register = function(params, res) {

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

            sonodaFacade.register(params);
        }
    ], function(err, result) {
        if (err) 
        {
            return res.status(500).json(err);
        }

        self.responseGeneration(res, err, result);

        return;
    });

    return;
}

sonoda.prototype.registrasiTBank = function(params, res) {
    var mysql = require('mysql');
    var conf = require('./config.json');
    var connection = mysql.createConnection(conf.mysql);
    var self = this;

    connection.connect();

    var q = "select * from ws_user where user_id = "+ params.user_id +" limit 1;";

    console.log(q);

    connection.query(q ,function(err, rows, fields) {
        console.log("selesai query");
        if (!err) {
            if (rows.length == 0) {
                connection.end();
                return res.status(500).json(err);
            }

            var user = rows[0];

            if (user != null) {
                self.responseGeneration(res, err, user);
                return;
            }

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

            soap.createClient(briUrl, function(err, client) {
                client.RegistrasiTBank(newParams, function(err, result) {
                    console.log(result);
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        var response = JSON.parse(result.RegistrasiTBankResult);
                        if (response.ResponseCode != "00") {
                            return res.status(500).json(err);
                        }
                        user.user_pin = response.PinNasabah;

                        var q = "update ws_user(user_name, user_email, user_password, user_phone, user_ktp, user_pin) " + 
                            "values ('" + user.user_name +"', '" + user.user_email +"', '" + user.user_password + "' " +
                            ", '" + user.user_phone + "', '" + user.user_ktp + "', '" + user.user_pin + "' " +
                            "where user_id = '" + user.user_id + "');";

                        connection.query(q ,function(err, rows, fields) {
                            if (!err) {
                              self.responseGeneration(res, err, user);
                            } else {
                              return res.status(500).json(err);
                            }
                            connection.end();
                        });
                    }
                });
            });

        } else {
            console.log('error_choy' + err);
            connection.end();
            return res.status(500).json(err);
        }
    });

    /*var asyncTask = require('async');
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
        if (err) {
            return res.status(500).json(err);
        }

        var user = result[0];

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

        asyncTask.waterfall([
            function(callback) {
                sonodaFacade.on("successSecond", function(response) {
                    return callback(null, response);
                });

                sonodaFacade.on("errorSecond", function(err) {
                    return callback(err, null);
                });

                sonodaFacade.registrasiTBank(newParams);
            }
        ], function(err, result) {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.ResponseCode != "00") {
                return self.responseGenerationError(res, result.ResponseDescription);
            }

            user.user_pin = result.PinNasabah;

            asyncTask.waterfall([
                function(callback) {
                    sonodaFacade.on("successThree", function(response) {
                        return callback(null, response);
                    });

                    sonodaFacade.on("errorThree", function(err) {
                        return callback(err, null);
                    });

                    sonodaFacade.updateUser(user);
                }
            ], function(err, result) {
                if (err) {
                    return res.status(500).json(err);
                }
                self.responseGeneration(res, err, user);
                return;
            });
            return;
        });        
        return;
    });

    return;*/
}

sonoda.prototype.infoSaldoTBank = function(params, res) {

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

                sonodaFacade.infoSaldoTBank(newParams);
            }
        ], function(err, result) {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.ResponseCode != "00") {
                return self.responseGenerationError(res, result.ResponseDescription);
            }

            var newResponse = {
                "saldo" : result.Saldo
            }

            self.responseGeneration(res, err, newResponse);
            return;
        });        
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
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var self = this;

    var debtParam = {
        'debt_id' : params.debt_id
    };

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.getDebtDataPayment(debtParam);
        }
    ], function(err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        var debt = result[0];
        var transferParams = {
            nohandphonePengirim : debt.pengirim,
            nohandphonePenerima : debt.penerima,
            pin : debt.pin,
            nominal : debt.nominal
        };

        asyncTask.waterfall([
            function(callback) {
                sonodaFacade.on("successSecond", function(response) {
                    return callback(null, response);
                });

                sonodaFacade.on("errorSecond", function(err) {
                    return callback(err, null);
                });

                sonodaFacade.transferTBank(transferParams);
            }
        ], function(err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.ResponseCode != "00") {
                return self.responseGenerationError(res, result.ResponseDescription);
            }

            console.log("transfer response \n");
            console.log(result);

            var updateParam = {
                debt_id : debt.debt_id,
                debt_status : '1'
            }

            asyncTask.waterfall([
                function(callback) {
                    sonodaFacade.on("successThree", function(response) {
                        return callback(null, response);
                    });

                    sonodaFacade.on("errorThree", function(err) {
                        return callback(err, null);
                    });

                    sonodaFacade.updataStatusDebt(updateParam);
                }
            ], function(err, result) {
                if (err) {
                    return res.status(500).json(err);
                }
                self.responseGeneration(res, err, result);
                return;
            });

            return;
        });

        return;
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


module.exports = new sonoda();
