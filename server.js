var express = require('express');   // Anropa express module så att vi kan använda den.
var app = express();                // Skapa en variabel för att kunna använda express() funktioner.

var bodyParser = require('body-parser');    // för att kunna använda bodyparser middleware och ändra HTML dokumentet genom method "POST" och "PUT"

app.use(bodyParser.urlencoded({             // true, för att acceptara vilken typ av value som helst när vi använder en request (t.ex req.body).
	extended: true                          // annars (false) kan vi bara acceptera en string eller array.
}));

var mongoose = require('mongoose');         // för att använda mongo db

var appConfig = {                           // för att ordna config.
    appPort         : 4000,
    mongoIP         : 'localhost',
    mongoPort       : '27017',
    mongoService    : 'tasksNew'
}

mongoose.connect('mongodb://' + appConfig.mongoIP + ':' + appConfig.mongoPort + '/' + appConfig.mongoService); // för att ansluta med databas som vi skapar.

var datos = ''; // variable för att lagra data från databas och så kan vi få en index som kan användas för att ha en hanterbar id. 

app.get('/', function (req, res) {
    res.sendFile( __dirname + '/public/html/index.html');
});


app.get('/api/todos', function (req, res) { // för att få alla dokument från modellen.

	Todo.find(function(err, todos) {
        if(err) {
            res.send(err);
        }
        datos = todos;
        res.json(todos);
    }).sort({_id: 1});      // för att få dokument med ordning från lägsta till högsta.

});


app.get('/api/todos/sort', function(req, res){

    Todo.find(function(err, todos) {
        if(err) {
            res.send(err);
        }
        datos = todos;
        res.json(datos);
        for (var i = 0; i < todos.length; i++) {
            Todo.update({
                text: todos[i].text   // ta elementet beroende på :id.
            },{
                id: (i + 1)    // ändra innehållet.

            }, function(err, todo){
                if(err) {
                    res.send(err);
                }
            });
        }
    });

});


app.put('/api/todos/:id', function (req, res) { // Redigera elementet
	
	Todo.update({
        id: req.params.id   // ta elementet beroende på :id.
    },{
    	text: req.body.text    // ändra innehållet.

    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        Todo.find(function(err, todos) {    // ta tillbaka alla dokument från modellen.
            if(err){
                res.send(err);
            }
            res.json(todos);
            datos = todos;
        });
    });

});


app.post('/api/todos', function (req, res) { // Skapa ett nytt element
	
	Todo.create({
        id: datos.length + 1,
        text: req.body.text,
        done: false
    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        Todo.find(function(err, todos) {    // ta tillbaka alla dokument från modellen.
            if(err){
                res.send(err);
            }
            res.json(todos);
            datos = todos;
        });
    });
});


app.delete('/api/todos/:id', function (req, res) { // Ta bort ett element beroende på :id
	
	Todo.remove({
       id: req.params.id
    }, function(err, todo) {
        if(err){
            res.send(err);
        }

        Todo.find(function(err, todos) {    // ta tillbaka alla dokument från modellen.
            if(err){
                res.send(err);
            }
            res.json(todos);
            datos = todos;
        });

    });

});


app.use(express.static('public'));	// middleware för att använda mappen "public".


var Todo = mongoose.model('Todo', {     // Skapa modellen för att lagra dokumenten.
    id: Number,
    text: String
});

var server = app.listen(appConfig.appPort, function () { // starting server

	console.log('Server started on port: ' + appConfig.appPort + ' ... Welcome!');

});