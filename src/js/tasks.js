var elements = {
	additionForm: document.getElementById("todo__addition"),
	additionSelect: document.getElementById("todo__addition__select"),
	buttonClass: 'todo__tasks__task--delete_button',
	checkboxClass: 'todo__tasks__task--checkbox',
	nameClass: 'todo__tasks__task--name',
	taskContainerClass: 'todo__tasks__task',
	tasksContainer: document.getElementById("todo__tasks")
};

var tasks = {
	current: [],
	xhrRequester: new XhrRequester(),

	add: function(elem) {
		var newTodoData = {};

		for (var i = 0; i < elem.elements.length - 1; i++ ) {
	    	var e = elem.elements[i];
			newTodoData[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
		}
		newTodoData.id -= 1;

		var taskToInsert = {
			name: newTodoData.name,
			checked: false
		};

		this.current.splice(newTodoData.id, 0, taskToInsert);
		this.updateViewWithAdd(newTodoData);

		this.xhrRequester.send('/tasks', 'PUT', newTodoData);
	},

	delete: function(index) {
		this.xhrRequester.send('/tasks', 'DELETE', {
			index: index 
		});
	},

	get: function() {
		this.xhrRequester.send('/tasks', 'GET');
	},

	post: function(data) {
		this.xhrRequester.send('/tasks', 'POST', data);
	},

	updateView: function() {
		console.log('updateView')

		while (elements.additionSelect.lastChild) {
			elements.additionSelect.removeChild(elements.additionSelect.lastChild);
		}

		while (elements.tasksContainer.lastChild) {
			elements.tasksContainer.removeChild(elements.tasksContainer.lastChild);
		}

		var fragForTasks = document.createDocumentFragment();
		var fragForOptions = document.createDocumentFragment();

		this.current.forEach(function(task, taskIndex) {
			tasks.createFragWithTask(fragForTasks, task, taskIndex);
			
			var newOption = document.createElement("option");
			newOption.appendChild(document.createTextNode(taskIndex + 1));
			fragForOptions.appendChild(newOption);

			elements.additionSelect.appendChild(newOption);
		});
		
		elements.tasksContainer.appendChild(fragForTasks)

		var newOption = document.createElement("option");
		newOption.appendChild(document.createTextNode(this.current.length + 1));
		fragForOptions.appendChild(newOption);

		elements.additionSelect.appendChild(fragForOptions);
	},

	createFragWithTask: function(fragForTasks, task, taskIndex) {
		var taskName = document.createElement("span");
		taskName.className = elements.nameClass;
		taskName.setAttribute('contenteditable', true);
		taskName.appendChild(document.createTextNode(task.name));

		var checkbox = document.createElement('input');
		checkbox.className = elements.checkboxClass;
		checkbox.type = "checkbox";
		checkbox.checked = task.checked;

		var deleteButton = document.createElement("button");
		deleteButton.className = elements.buttonClass;
		deleteButton.appendChild(document.createTextNode('delete'));

		var newTask = document.createElement("li"); 
		newTask.className = elements.taskContainerClass;
		newTask.appendChild(checkbox);
		newTask.appendChild(taskName);
		newTask.appendChild(deleteButton);
		fragForTasks.appendChild(newTask);
	},

	updateViewWithAdd: function(newTodoData) {
		var allTasks = elements.tasksContainer.getElementsByClassName(elements.taskContainerClass);

		var fragForTasks = document.createDocumentFragment();

		tasks.createFragWithTask(fragForTasks, newTodoData, newTodoData.id);
			
		elements.tasksContainer.insertBefore(fragForTasks, allTasks[newTodoData.id])

		var newOption = document.createElement("option");
		newOption.appendChild(document.createTextNode(this.current.length + 1));

		elements.additionSelect.appendChild(newOption);
	},

	updateViewWithDelete: function(element) {
		var parentNode = element.parentNode;
		parentNode.parentNode.removeChild(parentNode);
	}
};


function XhrRequester() {
	var xhr = new XMLHttpRequest();

	return {
		send: function(url, method, data) {
			xhr.open(method, url, true);
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = function () {
                console.log(this.responseText);

			    if (this.responseText !== JSON.stringify(tasks.current)) {
			    	console.log('difference')

			    	tasks.current = JSON.parse(this.responseText);
			    	tasks.updateView(this.responseText);
			    }
			};

			xhr.send(JSON.stringify(data));
		}
	};
}

var getUlIndex = function(elem) {
	return Array.prototype.indexOf.call(elem.parentNode.parentNode.childNodes, elem.parentNode);
}

document.addEventListener('DOMContentLoaded', function() {
	tasks.get();

	// add
	elements.additionForm.addEventListener('submit', function(event) {
		event.preventDefault();
		tasks.add(this);
	});

	// check
	elements.tasksContainer.addEventListener('change', function(event) {
		var id = getUlIndex(event.target);
		var newCheckedState = event.target.checked;

		tasks.current[id].checked = newCheckedState;

		tasks.post({
			checked: newCheckedState,
			index: id
		});
	});

	// delete
	elements.tasksContainer.addEventListener('click', function(event) {
		if (event.target.className !== elements.buttonClass) {
			return;
		}

		var id = getUlIndex(event.target);

		tasks.current.splice(id, 1);

		tasks.updateViewWithDelete(event.target);
		tasks.delete(id);
	});

	// edit name
	elements.tasksContainer.addEventListener('input', function(event) {
		var id = getUlIndex(event.target);
		var newName = event.target.innerHTML;

		tasks.current[id].name = newName;

		tasks.post({
			index: id,
			text: newName
		});
	});
});
