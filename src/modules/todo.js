export class Todo {
  constructor(title, description, dueDate, priority, notes = '') {
    this.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.complete = false;
  }
}
