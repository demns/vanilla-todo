var tasks = {
	current: {},

	add: function(elem) {
		var postData = {};

		for (var i = 0; i < elem.elements.length - 1; i++ ) {
	    	var e = elem.elements[i];
			postData[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
		}

		xhrRequester.sendPUT('/tasks', postData);
		return false;
	},

	delete: function(index) {
		xhrRequester.sendDELETE('/tasks', {
			index: index 
		});
	},

	get: function() {
		xhrRequester.sendGET('/tasks');
	},

	updateView: function(data) {
		this.current = JSON.parse(data);

		var selectNumberElement = document.getElementById("todo__addition__select");
		while (selectNumberElement.firstChild) {
		    selectNumberElement.removeChild(selectNumberElement.firstChild);
		}

		var todoTasksElement = document.getElementById("todo__tasks");
		while (todoTasksElement.firstChild) {
		    todoTasksElement.removeChild(todoTasksElement.firstChild);
		}

		this.current.forEach(function(task, taskIndex) {
			var taskName = document.createElement("span");
			taskName.className = 'todo__tasks__task--name';
			taskName.appendChild(document.createTextNode(task.name));

			var taskNumber = document.createElement("span");
			taskNumber.className = 'todo__tasks__task--number';
			taskNumber.appendChild(document.createTextNode(taskIndex + 1));

			var checkbox = document.createElement('input');
			checkbox.className = 'todo__tasks__task--checkbox';
			checkbox.type = "checkbox";
			checkbox.name = "todo__tasks__task--checkbox";
			checkbox.checked = task.checked;
			checkbox.id = "todo__tasks__task--checkbox";

			var deleteButton = document.createElement("button");
			deleteButton.className = 'todo__tasks__task--delete_button';
			deleteButton.appendChild(document.createTextNode('delete'));

			deleteButton.onclick = function() {
				tasks.delete(taskIndex + 1);
			};

			var newTask = document.createElement("div"); 
			newTask.className = "todo__tasks__task";
			newTask.appendChild(taskNumber);
			newTask.appendChild(checkbox);
			newTask.appendChild(taskName);
			newTask.appendChild(deleteButton);

			todoTasksElement.appendChild(newTask);

			var newOption = document.createElement("option");
			newOption.appendChild(document.createTextNode(taskIndex + 1));

			selectNumberElement.appendChild(newOption);
		});
		
		var newOption = document.createElement("option");
		newOption.appendChild(document.createTextNode(this.current.length + 1));
		
		selectNumberElement.appendChild(newOption);
	}
};

var xhrRequester = {
	sendDELETE: function(url, data) {
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
		    console.log(this.responseText);
		    tasks.updateView(this.responseText);
		};

		xhr.send(JSON.stringify(data));
	},

	sendGET: function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function () {
		    console.log(this.responseText);
		    tasks.updateView(this.responseText);
		};

		xhr.send();
	},

	sendPUT: function (url, data) {
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
		    console.log(this.responseText);
			tasks.updateView(this.responseText)
		};

		xhr.send(JSON.stringify(data));
	}
}

window.onload = function() {
	tasks.get();
}