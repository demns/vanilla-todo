var tasks = {
	current: {},

	add: function(elem) {
		var postData = {};

		for (var i = 0; i < elem.elements.length - 1; i++ ) {
	    	var e = elem.elements[i];
			postData[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
		}

		xhrRequester.send('/tasks', 'PUT', postData); //
	},

	delete: function(index) {
		xhrRequester.send('/tasks', 'DELETE', {
			index: index 
		});
	},

	get: function() {
		xhrRequester.send('/tasks', 'GET');
	},

	post: function(text, id, checked) {
		xhrRequester.send('/tasks', 'POST', {
			checked: checked,
			index: id,
			text: text
		});
	},

	updateView: function(data) {
		this.current = JSON.parse(data);

		var selectNumberElement = document.getElementById("todo__addition__select");
		var todoTasksElement = document.getElementById("todo__tasks");

		while (selectNumberElement.firstChild) {
		    selectNumberElement.removeChild(selectNumberElement.firstChild);
		}

		while (todoTasksElement.firstChild) {
		    todoTasksElement.removeChild(todoTasksElement.firstChild);
		}

		this.current.forEach(function(task, taskIndex) {
			var taskName = document.createElement("span");
			taskName.className = 'todo__tasks__task--name';
			taskName.setAttribute('contenteditable', true);
			taskName.setAttribute('data-id', taskIndex + 1);
			taskName.appendChild(document.createTextNode(task.name));

			taskName.onblur = function () {
				tasks.post(this.innerHTML, taskIndex + 1, task.checked);
			};

			var taskNumber = document.createElement("span");
			taskNumber.className = 'todo__tasks__task--number';
			taskNumber.appendChild(document.createTextNode(taskIndex + 1));

			var checkbox = document.createElement('input');
			checkbox.className = 'todo__tasks__task--checkbox';
			checkbox.type = "checkbox";
			checkbox.checked = task.checked;
			checkbox.onchange = function() {
				tasks.post(task.name, taskIndex + 1, !task.checked);
			}

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
		//createdocumentfragment
		selectNumberElement.appendChild(newOption);
	}
};

var xhr = new XMLHttpRequest();

var xhrRequester = {
	send: function(url, method, data) {
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
		    console.log(this.responseText);
		    tasks.updateView(this.responseText);
		};

		xhr.send(JSON.stringify(data));
	}
}

window.onload = function() {
	tasks.get();

	var todoAddition = document.getElementById("todo__addition");
	todoAddition.onsubmit = function(event) {
		tasks.add(this);

		return false;
	};
}	