var tasks = {
	add: function(elem) {
		var createPOSTData = function(elem) {
			console.log(elem.elements);

			return {};
		};

		var data = createPOSTData(elem);

		xhrRequester.sendPOST('/tasks', data);
		return false;
	},

	get: function() {
		xhrRequester.sendGET('/tasks', this.updateView);
	},

	updateView: function(data) {
		var tasks = JSON.parse(data);

		tasks.forEach(function(task, taskIndex) {
			var taskName = document.createElement("span");
			taskName.className = 'todo__tasks__task--name';
			taskName.appendChild(document.createTextNode(task.name));

			var todoTasksElement = document.getElementById("todo__tasks");
			var newDiv = document.createElement("div"); 
			newDiv.className = "todo__tasks__task";

			newDiv.appendChild(taskName);

			todoTasksElement.appendChild(newDiv);
		});

		// <input class="todo__tasks__checked" type="checkbox" name="123" value="321">
		// <span class="todo__tasks__number"></span>
		// <button type="submit" type="button">edit</button>
		// <button type="submit" type="button">delete</button>
		// var todoTasksElement = document.getElementById("todo__tasks");
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
		xhr.onload = function () {
		    console.log(this.responseText);
		};

		xhr.send(data);
	}
}

window.onload = function() {
	tasks.get();
}