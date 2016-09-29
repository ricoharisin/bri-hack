var eventEmitter = new require('events').EventEmitter();
var sonodaCore = function() {};

sonodaCore.prototype = Object.create(require('events').EventEmitter.prototype);

sonodaCore.prototype.getUserPersonalDepartment = function(params) {
	//this.calculateUserScore(1)
	var mysql      = require('mysql');
	var conf = require('./config.json');
	var connection = mysql.createConnection(conf.mysql);
	var self = this;

	connection.connect();

  	var q = 'SELECT * from ws_personal_user where user_id = '+params.user_id+';';
	console.log(q);

	  connection.query(q ,function(err, rows, fields) {
		  if (!err) {
	      console.log('The solution is: ', rows);
			  self.calculateUserScore(rows[0], params.page);
		  } else {
		    console.log('error '+err);
		    self.emit('error', err);
		  }
		});

	connection.end();
}

sonodaCore.prototype.calculateUserScore = function(rows, page) {
	var self = this;
	var data = [];
	var totalScore = rows.dep_78 + rows.dep_297 + rows.dep_65 + rows.dep_578 + rows.dep_983;
	console.log("Total Score : "+totalScore);

	var dep_78 = ((rows.dep_78 / totalScore) * 10).toFixed(0);
	if (dep_78 == 0) dep_78 = -1;

	console.log("78 score: "+dep_78);

	var dep_297 = ((rows.dep_297 / totalScore) * 10).toFixed(0);
	if (dep_297 == 0) dep_297 = -1;

	console.log("297 score: "+dep_297);

	var dep_65 = ((rows.dep_65 / totalScore) * 10).toFixed(0);
	if (dep_65 == 0) dep_65 = -1;

	console.log("65 score: "+dep_65);

	var dep_578 = ((rows.dep_578 / totalScore) * 10).toFixed(0);
	if (dep_578 == 0) dep_578 = -1;

	console.log("578 score: "+dep_578);

	var dep_983 = ((rows.dep_983 / totalScore) * 10).toFixed(0);
	if (dep_983== 0) dep_983 = -1;

	console.log("983 score: "+dep_983);

	var depId = [{
				dep_id : '78',
				score : dep_78,
				start : page * dep_78
			},{
				dep_id : '297',
				score : dep_297,
				start : page * dep_297
			},{
				dep_id : '65',
				score : dep_65,
				start : page * dep_65
			},{
				dep_id : '578',
				score : dep_578,
				start : page * dep_578
			},{
				dep_id : '983',
				score : dep_983,
				start : page * dep_983
			}];

	depId.sort(function(a, b) {
    	return parseFloat(b.score) - parseFloat(a.score);
	});

	var totalSubScore = dep_78+dep_65+dep_297+dep_578+dep_983;

	if (totalScore < 10) {
		self.getRandomProduct(page);

		return;
	} else {
		self.getDataFromApi(data, depId, 0);

		return;
	}


}

sonodaCore.prototype.getDataFromApi = function(data, listDep, index) {
	var rp = require('request-promise');
	var self = this;
	var detailDep = listDep[index];

	var options = {
	    uri: 'http://ajax.tokopedia.com/search/v1/product',
	    qs: {
	        sc: detailDep.dep_id,
			rows: detailDep.score,
			start: detailDep.start,
			ob: '7'
	    },
	    json: true // Automatically parses the JSON string in the response
	};

	rp(options)
		    .then(function (repos) {
		        console.log(repos);
				data = data.concat(repos.data);
				console.log(listDep);
				index = index + 1;
				if (index < listDep.length) {
					self.getDataFromApi(data, listDep, index);
				} else {
					var result = { 'data' : data };
					self.emit("success", result);
				}
		    })
		    .catch(function (err) {
				console.log(err);
		    });
	}

sonodaCore.prototype.getRandomProduct = function(page) {
	var self = this;
	var rp = require('request-promise');
	var options = {
	    uri: 'http://ajax.tokopedia.com/search/v1/product',
	    qs: {
			rows: 10,
			start: page*10,
			ob: '7'
	    },
	    json: true // Automatically parses the JSON string in the response
	};

	rp(options)
		    .then(function (repos) {
				var result = { 'data' : repos.data };
				self.emit("success", result);
		    })
		    .catch(function (err) {
				console.log(err);
		    });
}

module.exports = new sonodaCore();
