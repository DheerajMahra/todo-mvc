function getId() {
  let i = 0;
  return function generator() {
    return ++i;
  };
}
let uniqueId = getId();

class Model {
  constructor() {
    this.todos = [];
  }

  addTodo(text) {
    this.todos = [...this.todos, { id: uniqueId(), text, completed: false }];
    console.log(this.todos);
    this.onTodoListChanged(this.todos);
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        return todo;
      }
      return todo;
    });
    console.log(this.todos);
    this.onTodoListChanged(this.todos);
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }
}

class View {
  constructor() {
    this.app = this.getElement("#root");

    this.form = this.createElement("form");

    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.name = "todo";
    this.input.placeholder = "Add todos";

    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Add";

    this.todoList = this.createElement("ul", "todo-list");

    this.form.append(this.input, this.submitButton);
    this.app.append(this.form, this.todoList);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  displayTodos(todos) {
    //clear todo list
    this.todoList.innerHTML = "";

    let todoListFragmnt = document.createDocumentFragment();
    todos.map((todo) => {
      const li = this.createElement("li");
      li.id = todo.id;
      let text;

      if (todo.completed) {
        text = this.createElement("s");
        text.textContent = todo.text;
        text.id = todo.id;
      } else {
        text = this.createElement("span");
        text.textContent = todo.text;
        text.id = todo.id;
      }

      li.append(text);
      todoListFragmnt.append(li);
    });

    this.todoList.append(todoListFragmnt);
  }

  bindAddTodo(handler) {
    this.form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        if (this.input.value) {
          handler(this.input.value);
          this.input.value = "";
        }
      }.bind(this)
    );
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener(
      "click",
      function (e) {
        const id = parseInt(e.target.id);
        handler(id);
      }.bind(this)
    );
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onTodoListChange(this.model.todos);

    this.view.bindAddTodo(this.handleAddTodo.bind(this));
    this.view.bindToggleTodo(this.handleToggleTodo.bind(this));

    this.model.bindTodoListChanged(this.onTodoListChange.bind(this));
  }

  onTodoListChange(todos) {
    this.view.displayTodos(todos);
  }

  handleAddTodo(todoText) {
    this.model.addTodo(todoText);
  }

  handleToggleTodo(todoId) {
    this.model.toggleTodo(todoId);
  }
}

const app = new Controller(new Model(), new View());
