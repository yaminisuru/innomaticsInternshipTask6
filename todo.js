let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

addTodoButton.onclick = function () {
  onAddTodo();
};

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let dueDateElement = document.getElementById("dueDateInput");
  let priorityElement = document.getElementById("priorityInput");
  let categoryElement = document.getElementById("categoryInput");

  let userInputValue = userInputElement.value;
  let dueDateValue = dueDateElement.value;
  let priorityValue = priorityElement.value;
  let categoryValue = categoryElement.value;

  if (userInputValue === "") {
    alert("Please enter a valid task");
    return;
  }

  todosCount += 1;

  let newTodo = {
    id: todosCount,
    text: userInputValue,
    dueDate: dueDateValue,
    priority: priorityValue,
    category: categoryValue,
    isChecked: false,
  };

  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
  dueDateElement.value = "";
  priorityElement.value = "low";
  categoryElement.value = "";
}

function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex((todo) => todo.id === todoId);
  todoList[todoObjectIndex].isChecked = !todoList[todoObjectIndex].isChecked;
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(`todo${todoId}`);
  todoItemsContainer.removeChild(todoElement);
  todoList = todoList.filter((todo) => todo.id !== todoId);
}

function createAndAppendTodo(todo) {
  let todoId = `todo${todo.id}`;
  let checkboxId = `checkbox${todo.id}`;
  let labelId = `label${todo.id}`;

  let todoElement = document.createElement("li");
  todoElement.id = todoId;
  todoElement.classList.add("todo-item-container");

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;
  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todo.id);
  };

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.textContent = `${todo.text} (Due: ${todo.dueDate}, Priority: ${todo.priority}, Category: ${todo.category})`;
  labelElement.classList.toggle("checked", todo.isChecked);

  let deleteButton = document.createElement("i");
  deleteButton.classList.add("far", "fa-trash-alt");
  deleteButton.onclick = function () {
    onDeleteTodo(todo.id);
  };

  todoElement.appendChild(inputElement);
  todoElement.appendChild(labelElement);
  todoElement.appendChild(deleteButton);
  todoItemsContainer.appendChild(todoElement);
}

for (let todo of todoList) {
  createAndAppendTodo(todo);
}

// Filter Functionality
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    let filter = btn.getAttribute("data-filter");
    filterTasks(filter);
  });
});

function filterTasks(filter) {
  todoItemsContainer.innerHTML = "";

  let filteredList = todoList.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.isChecked;
    if (filter === "pending") return !todo.isChecked;
  });

  for (let todo of filteredList) {
    createAndAppendTodo(todo);
  }
}
