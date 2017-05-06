require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var moment = require('moment-timezone');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(3001);
console.log("Server running on port 3001");


var user = process.env.user || 'root';
var password = process.env.password || 'root';
var database = process.env.database || 'student';
var host = process.env.host || 'localhost';
var timezone = process.env.TIMEZONE || 'Asia/Singapore';

// Create a connection to the db
var con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


app.get('/user', function (req, res) {
	console.log('I received a GET request');
	con.query('SELECT * FROM users',function(err,rows){
		if(err) throw err;
		console.log('Data received from Db:\n');
		res.json(rows);
		console.log(rows);
	});
});

app.post('/user', function (req, res) {
	var timestamp = moment().tz('UTC').unix();
	var data = req.body;

	// if(data.label && typeof data.label != 'string') {
	// 	res.statusCode = 422;
	//     res.json({errors: 'Key should be string'});
	// }

	if(!data.label || !data.value) {
		res.statusCode = 400;
	    return res.json({errors: 'key and value is required'});
	}
 	var user = { label: data.label, value: data.value, timestamp: timestamp};
	con.query('INSERT INTO users SET ?', user, function(err,res){
		if(err) {
			res.statusCode = 500;
		    return res.json({errors: 'failed to create user'});
		}

	var sql = 'SELECT * FROM users where id = ?';
	con.query(sql, [res.insertId] ,function(err,rows){
		if(err) {
			res.statusCode = 500;
		    return res.json({errors: 'couldnot retrieve user after create'});
		}

		if(rows.length === 0) {
			res.statusCode = 404;
		    return res.json({errors: 'user not found'});
		}

		console.log('rows[0]', rows[0]);
		//res.statusCode = 201;
    	//return res.json({message: 'OK'});

	});
	   
	
	});
});

app.get('/user/:key', function (req, res) {
	console.log('req.params', req.params);
	
	var key = req.params.key;
	var timestamp = req.query.timestamp;
	

	// if(req.body.label && typeof req.body.label != 'string') {
	// 	res.statusCode = 422;
	//     res.json({errors: 'Key should be string'});
	// }
	// if(timestamp && typeof timestamp != 'number') {
	// 	res.statusCode = 422;
	// 	return res.json({errors: 'Timestamp should be number'});
	// }
	var sql = 'SELECT * FROM users where label = ?';
	var data = [key];
	if(timestamp) {
		sql = 'SELECT * FROM users where label = ? and timestamp = ?';	
		data = [key, timestamp];
	}


	con.query(sql, data ,function(err,rows) {
		if(err) {
			res.statusCode = 500;
		    res.json({errors: 'Failed to get user'});
		}

		if(rows.length === 0) {
			res.statusCode = 404;
		    res.json({errors: 'User not found'});
		}

		res.statusCode = 201;
  		res.json(rows[rows.length-1]);

	});
	
});


app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
