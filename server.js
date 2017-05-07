require('dotenv').load();
var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var moment = require('moment-timezone');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



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
		if(err) {
			res.statusCode = 500;
		    return res.json({errors: ['failed to get users']});
		}
		res.json(rows);
	});
});

app.post('/user', upload.any(), function (req, res) {

	var timestamp = moment().tz(timezone).unix();
	var data = req.body;

	 	
	if(req.files && req.files.length) {
		
		var user = { label: data.label, value: req.files[0].originalname, timestamp: timestamp};

		if(!data.label) {
			res.statusCode = 400;
		    return res.json({errors: ['label is required']});
		}


		con.query('INSERT INTO users SET ? ', user, function(err,row){
			if(err) {
				res.statusCode = 500;
			    return res.json({errors: ['failed to create user']});
			}
		});

		res.statusCode = 200;
		var msg = req.files[0].originalname + ' successfully uploaded';
    	return res.json({message: [msg]});
		
	} else {
	
		var user = { label: data.label, value: data.value, timestamp: timestamp};
	
		if(!data.label || !data.value) {
			res.statusCode = 400;
		    return res.json({errors: ['label and value is required']});
		}

		con.query('INSERT INTO users SET ? ', user, function(err,row){
			if(err) {
				res.statusCode = 500;
			    return res.json({errors: ['failed to create user']});
			}

			var sql = 'SELECT * FROM users where id = ?';
			con.query(sql, [row.insertId] ,function(err,rows) {
				if(err) {
					res.statusCode = 500;
				    return res.json({errors: ['couldnot retrieve user after create']});
				}

				if(rows.length === 0) {
					res.statusCode = 404;
				    return res.json({errors: ['user not found']});
				}

				console.log('rows[0]', rows[0]);
				res.statusCode = 200;
				var msg = rows[0].value + ' successfully created';
		    	return res.json({message: [msg]});
		    	

			});
		});
	}
});

app.get('/user/:key', function (req, res) {
	console.log('req.params', req.params);
	
	var key = req.params.key;
	var timestamp = req.query.timestamp;
    key = mysql.escape(key);
	var query = "SELECT * FROM users where label = " + key;
	
	if(timestamp) {
		query = "SELECT * FROM users where label = " + key + 'and timestamp = ' + timestamp;	
	}

	con.query(query ,function(err,rows) {
		
		if(err) {
			res.statusCode = 500;
		    return res.json({errors: 'failed to get user'});
		}

		if(rows.length === 0) {
			res.statusCode = 404;
		    return res.json({errors: 'user not found'});
		}

		res.statusCode = 201;
  		return res.json(rows[rows.length-1]);

	});
	
});


app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3001);
console.log("Server running on port 3001");