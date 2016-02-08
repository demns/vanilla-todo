var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var serveStatic = require('serve-static');

var app = express();

var tasksJSONPath = './data/tasks.json';

app.use(serveStatic('src', {'index': ['index.html']}));
app.use(bodyParser.json());

app.post('/tasks', function(request, respond) {
	var newTask = request.body;

	readJSONFile(tasksJSONPath, function (err, tasks) {
		var taskToInsert = {
			name: newTask.name,
			checked: false
		};

		tasks.splice(newTask.id - 1, 0, taskToInsert);

		var newTasks = JSON.stringify(tasks);
		fs.writeFile(tasksJSONPath, newTasks, function() {
			respond.send(newTasks);
		});
	});


	// console.log(request)
	// request.on('data', function(data) {
 //        console.log(data)
 //    });
 //    request.on('end', function (){
 //        // fs.appendFile(filePath, body, function() {
 //        //     respond.end();
 //        // });
 //    });

    // var body = '';
    // filePath = __dirname + '/data/data.txt';
    // request.on('data', function(data) {
    //     body += data;
    // });

    // request.on('end', function (){
    //     fs.appendFile(filePath, body, function() {
    //         respond.end();
    //     });
    // });
});

app.get('/tasks', function(request, respond) {
	readJSONFile(tasksJSONPath, function (err, data) {
		respond.send(data);
	});
})

function readJSONFile(filename, callback) {
	console.log(filename)
	require("fs").readFile(filename, function (err, data) {
		if(err) {
			callback(err);
			return;
		}

		try {
			callback(null, JSON.parse(data));
		} catch(exception) {
			callback(exception);
		}
	});
}

app.listen(3000);
console.log('listening on http://localhost:3000');