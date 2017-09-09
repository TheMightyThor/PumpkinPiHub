var express = require('express')
    , fs = require('fs')
    , route = express.Router()
    , pg = require('pg')
    , path = require('path');

var app = express();


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
    console.log(req.headers);
    // if(process.env.xyz !== req.headers.xyz)
    //     res.end();
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const insertStatement = 'INSERT INTO Image (name,createdate, numba) VALUES (\'' + req.query.name + '\', localtimestamp, ' + req.query.numba +') RETURNING * ;';
    client.query(insertStatement, function (err, result) {

        if (err) {
            res.end('ERROR ' + err);
        }
        else {
            res.send({results: result.rows, extraInfo: process.env.xyz});
        }
    });
});
app.get('/api/imageData', function (req, res) {

    var  numba = 3;
    if(req.query.time){
        switch(req.query.time){
            case '8:00 am':
                numba = 1;
            case '11:00 am':
                numba = 2;
            case '2:00 pm':
                numba = 3;
            case '5:00 pm':
                numba = 4;
        }
    }

    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();


    client.query('SELECT name, createdate From Image ORDER BY createdate ASC ;', function (err, result) {
        if (err) {
            res.send('Something bad happend' + err);
        }

        else {
            if(result.rows.length > 0) {
                res.send(JSON.stringify(result.rows));
            }
            else {
                now.setDate(now.getDate() - 1);
                client.query('SELECT name, createdate From Image WHERE numba = '+ numba +' ORDER BY createdate ASC ;', function (err, result) {
                    if (err) {
                        res.send('Something bad happend' + err);
                        now = new Date();
                    }
                    else {
                        if (result.rows.length > 0) {
                            res.send(JSON.stringify(result.rows));
                            now = new Date();
                        }
                    }
                });
            }
        }
    });
});
