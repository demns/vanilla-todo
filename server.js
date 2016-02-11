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

	tasks = JSON.parse(readJSONFile(tasksJSONPath));

	var taskToInsert = {
		name: newTask.name,
		checked: false
	};

	tasks.splice(newTask.id - 1, 0, taskToInsert);

	var newTasks = JSON.stringify(tasks);
	fs.writeFileSync(tasksJSONPath, newTasks);

	respond.send(newTasks);
});

app.post('/tasks', function(request, respond) {
	var taskToUpdateId = request.body && request.body.index;
	var taskToUpdateText = request.body && request.body.text;
	var taskToUpdateChecking = request.body && request.body.checked;

	tasks = JSON.parse(readJSONFile(tasksJSONPath));
	
	if (taskToUpdateText) { 
		tasks[taskToUpdateId - 1].name = taskToUpdateText;
	}
	
	tasks[taskToUpdateId - 1].checked = taskToUpdateChecking;

	var newTasks = JSON.stringify(tasks);
	fs.writeFileSync(tasksJSONPath, newTasks);

	respond.send(newTasks);
});

app.get('/tasks', function(request, respond) {
	respond.send(readJSONFile(tasksJSONPath));
});

app.delete('/tasks', function(request, respond) {
	var taskToDelete = request.body && request.body.index;

	var tasks = JSON.parse(readJSONFile(tasksJSONPath));

	tasks.splice(taskToDelete - 1, 1);

	var newTasks = JSON.stringify(tasks);
	fs.writeFileSync(tasksJSONPath, newTasks);

	respond.send(newTasks);
});

function readJSONFile(filename, callback) {
	return fs.readFileSync(filename, {
		encoding: 'utf8'
	});
}

app.listen(3000);
console.log('listening on http://localhost:3000');