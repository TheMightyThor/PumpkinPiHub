var express = require('express')
    , fs = require('fs')
    , route = express.Router()
    , multer = require('multer')
    , path = require('path');
var app = express();

var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/slideshow', function (req, res) {
    res.render('pages/slideshow');
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
app.post('/api/imageData', function (req, res) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const insertStatement = 'INSERT INTO Image (name,createdate) VALUES (\'' + req.query.name + '\', localtimestamp) RETURNING * ;';
    client.query(insertStatement, function (err, result) {

        if (err) {
            res.end('ERROR ' + err);
        }
        else {
            res.send({results: result.rows});
        }
    });
});
app.get('/api/imageData', function (req, res) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const now = new Date();
    const now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    client.query('SELECT name, createdate From Image WHERE createdate >=\' ' + now_utc.toISOString().substring(0, 10) + '\'ORDER BY createdate ASC ;', function (err, result) {

        if (err) {
            res.send('Something bad happend' + err);
        }
        else {
            res.send(JSON.stringify(result.rows));
        }
    });
});
