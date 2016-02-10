var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var serveStatic = require('serve-static');

var app = express();

var tasksJSONPath = './data/tasks.json';

app.use(serveStatic('src', {'index': ['index.html']}));
app.use(bodyParser.json());

app.put('/tasks', function(request, respond) {
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
});

app.post('/tasks', function(request, respond) {
	var taskToUpdateId = request.body && request.body.index;
	var taskToUpdateText = request.body && request.body.text;
	var taskToUpdateChecking = request.body && request.body.checked;

	readJSONFile(tasksJSONPath, function (err, tasks) {
		tasks[taskToUpdateId - 1].name = taskToUpdateText;
		tasks[taskToUpdateId - 1].checked = !taskToUpdateChecking;

		var newTasks = JSON.stringify(tasks);
		fs.writeFile(tasksJSONPath, newTasks, function() {
			respond.send(newTasks);
		});
	});
});

app.get('/tasks', function(request, respond) {
	readJSONFile(tasksJSONPath, function (err, data) {
		respond.send(data);
	});
});

app.delete('/tasks', function(request, respond) {
	var taskToDelete = request.body && request.body.index;

	readJSONFile(tasksJSONPath, function (err, tasks) {
		tasks.splice(taskToDelete - 1, 1);

		var newTasks = JSON.stringify(tasks);
		fs.writeFile(tasksJSONPath, newTasks, function() {
			respond.send(newTasks);
		});
	});
});

function readJSONFile(filename, callback) {
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