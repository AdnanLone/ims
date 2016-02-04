/**
 * Created by adnanlone on 2/3/16.
 */
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
//var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

console.log()

//
//http.listen(PORT, function () {
 //   console.log('Server started!');
//});