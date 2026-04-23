import { Project } from './project';
import { Todo } from './todo';
import { save, load } from './storage';

class App {
  constructor() {
    const data = load();
    if (data && data.projects && data.projects.length > 0) {
      this.projects = this._hydrateProjects(data.projects);
      this.activeId = data.activeId || this.projects[0].id;
    } else {
      const defaultProject = new Project('Default');
      this.projects = [defaultProject];
      this.activeId = defaultProject.id;
      this._save();
    }
  }

  _hydrateProjects(rawProjects) {
    return rawProjects.map((pData) => {
      const project = new Project(pData.name);
      project.id = pData.id;
      project.todos = pData.todos.map((tData) => {
        const todo = new Todo(tData.title, tData.description, tData.dueDate, tData.priority, tData.notes);
        todo.id = tData.id;
        todo.complete = tData.complete;
        return todo;
      });
      return project;
    });
  }

  _save() {
    save({ projects: this.projects, activeId: this.activeId });
  }

  get active() {
    return this.projects.find((p) => p.id === this.activeId) || this.projects[0];
  }

  setActive(id) {
    this.activeId = id;
    this._save();
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.activeId = project.id;
    this._save();
    return project;
  }

  deleteProject(id) {
    if (this.projects.length <= 1) return;
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.activeId === id) this.activeId = this.projects[0].id;
    this._save();
  }

  addTodo(title, description, dueDate, priority, notes = '') {
    const todo = new Todo(title, description, dueDate, priority, notes);
    this.active.addTodo(todo);
    this._save();
    return todo;
  }

  deleteTodo(id) {
    this.active.removeTodo(id);
    this._save();
  }

  updateTodo(id, fields) {
    const todo = this.active.getTodo(id);
    if (todo) {
      Object.assign(todo, fields);
      this._save();
    }
  }

  toggleTodo(id) {
    const todo = this.active.getTodo(id);
    if (todo) {
      todo.complete = !todo.complete;
      this._save();
    }
  }
}

export const app = new App();
