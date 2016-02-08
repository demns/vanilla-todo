var tasks = {
	current: {},

	add: function(elem) {
		var postData = {};

		for (var i = 0; i < elem.elements.length - 1; i++ ) {
	    	var e = elem.elements[i];
			postData[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
		}

		xhrRequester.sendPOST('/tasks', postData);
		return false;
	},

	get: function() {
		xhrRequester.sendGET('/tasks', this.updateView);
	},

	updateView: function(data) {
		this.current = JSON.parse(data);

		var selectNumberElement = document.getElementById("todo__addition__select");

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

			var newTask = document.createElement("div"); 
			newTask.className = "todo__tasks__task";
			newTask.appendChild(taskNumber);
			newTask.appendChild(checkbox);
			newTask.appendChild(taskName);

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
	sendGET: function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function () {
		    console.log(this.responseText);
		    callback(this.responseText);
		};

		xhr.send();
	},

	sendPOST: function (url, data) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
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