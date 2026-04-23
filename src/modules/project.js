export class Project {
  constructor(name) {
    this.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  getTodo(id) {
    return this.todos.find((t) => t.id === id);
  }
}
