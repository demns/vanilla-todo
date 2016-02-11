var elements = {
	additionForm: document.getElementById("todo__addition"),
	additionSelect: document.getElementById("todo__addition__select"),
	tasksContainer: document.getElementById("todo__tasks")
};

var tasks = {
	current: [],
	xhrRequester: new XhrRequester(),

	add: function(elem) {
		var postData = {};

		for (var i = 0; i < elem.elements.length - 1; i++ ) {
	    	var e = elem.elements[i];
			postData[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
		}

		var taskToInsert = {
			name: postData.name,
			checked: false
		};

		this.current.splice(postData.id - 1, 0, taskToInsert);
		this.updateViewWithAdd();

		this.xhrRequester.send('/tasks', 'PUT', postData); //
	},

	delete: function(index) {
		this.xhrRequester.send('/tasks', 'DELETE', {
			index: index 
		});
	},

	get: function() {
		this.xhrRequester.send('/tasks', 'GET');
	    tasks.updateView(this.responseText);
	},

	post: function(data) {
		this.xhrRequester.send('/tasks', 'POST', data);
	},

	updateView: function() {
		console.log('updateView')
		if (this.current.length === 0) return;

		while (elements.additionSelect.lastChild) {
			elements.additionSelect.removeChild(elements.additionSelect.lastChild);
		}

		while (elements.tasksContainer.lastChild) {
			elements.tasksContainer.removeChild(elements.tasksContainer.lastChild);
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
				tasks.post({
					checked: !task.checked,
					index: taskIndex + 1,
					text: task.name
				});
			};

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

			elements.tasksContainer.appendChild(newTask);

			var newOption = document.createElement("option");
			newOption.appendChild(document.createTextNode(taskIndex + 1));

			elements.additionSelect.appendChild(newOption);
		});
		
		var newOption = document.createElement("option");
		newOption.appendChild(document.createTextNode(this.current.length + 1));
		//createdocumentfragment
		elements.additionSelect.appendChild(newOption);
	},

	updateViewWithAdd: function() {
		
	}
};


function XhrRequester() {
	var xhr = new XMLHttpRequest();

	return {
		send: function(url, method, data) {
			xhr.open(method, url, true);
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = function () {
				console.log('post done')
			    console.log(this.responseText);
			    if (this.responseText !== JSON.stringify(tasks.current)) {
			    	tasks.current = JSON.parse(this.responseText);
			    	tasks.updateView(this.responseText);
			    }
			};

			xhr.send(JSON.stringify(data));
		}
	};
}

window.addEventListener('load', function() {
	tasks.get();

	elements.additionForm.addEventListener('submit', function(event) {
		event.preventDefault();
		tasks.add(this);
	});
});
