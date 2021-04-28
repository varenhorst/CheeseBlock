/**
* Module dependencies.
*/
const express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//const methodOverride = require('method-override');
const session = require('express-session');
// const cors = require('cors')
const app = express();
const mysql      = require('mysql');
let bodyParser=require("body-parser");
let connection = mysql.createConnection({
               host     : 'HOST',
               user     : 'ROOT',
               password : 'PASSWORD',
               database : 'DATABASE_NAME',
               port: PORT_NO
            });
 
connection.connect();
 
global.db = connection;

// express.static.mime.define({
//     'text/plain': ['php']
// });

 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors())
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/public', express.static(path.join(__dirname, 'public')))


// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only
console.log("hey");
 
app.get('/', routes.index);//call for main index page
app.get('header',user.profile);//to render users profile
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile

app.get('/skip',function(req,res){
  // var data = req.body;
  //console.log(req.query.url);
  var sql = "SELECT * FROM `Skips`.`skips` WHERE url = " + "'" + req.query.url + "'";

  // console.log(sql);
  var data;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    data = result;
    res.send({message: data});
    console.log("Rows affected: " + result.affectedRows);
  });
  // console.log(data,"RESULT");
});

app.post('/skip',function(req,res){
  // var data = req.body;
  console.log(req);
 
  var sql = "INSERT INTO skips VALUES ?";

  arr = [];
  for(var i = 0; i < req.body.length; i++){
    var temp = [req.body[i]['url'],req.body[i]['from'],req.body[i]['to']];
    arr.push(temp);
  }

  var data;
  connection.query(sql, [arr], function (err, result) {
    if (err) throw err;
    console.log("Rows affected: " + result.affectedRows);
  });
  // console.log(data,"RESULT");
});

// app.post("/", function(req, res) {
//   var data = req.body;

//   var sql = "INSERT INTO skips VALUES ?";
//   var values = [
//     [null, data.url, data.init, data.from],
//   ];

//   connection.query(sql, [values], function (err, result) {
//     if (err) throw err;
//     console.log("Rows affected: " + result.affectedRows);
//   });


//   res.send({message: 'Woohoo'});
// });
//Middleware
app.listen(8080)
