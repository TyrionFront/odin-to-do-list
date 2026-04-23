import { app } from '../modules/app';
import { format, parseISO, isValid } from 'date-fns';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMM d, yyyy') : dateStr;
  } catch {
    return dateStr;
  }
};

const projectList = document.getElementById('project-list');
const projectTitle = document.getElementById('project-title');
const todoList = document.getElementById('todo-list');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');

const renderProjects = () => {
  projectList.innerHTML = '';
  app.projects.forEach((p) => {
    const li = document.createElement('li');
    li.className = `project-item${p.id === app.activeId ? ' active' : ''}`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'project-name';
    nameSpan.textContent = p.name;
    nameSpan.addEventListener('click', () => {
      app.setActive(p.id);
      render();
    });

    li.appendChild(nameSpan);

    if (app.projects.length > 1) {
      const del = document.createElement('button');
      del.className = 'btn-icon delete-project';
      del.innerHTML = '&times;';
      del.title = 'Delete project';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete project "${p.name}"?`)) {
          app.deleteProject(p.id);
          render();
        }
      });
      li.appendChild(del);
    }

    projectList.appendChild(li);
  });
};

const renderTodos = () => {
  const project = app.active;
  projectTitle.textContent = project.name;
  todoList.innerHTML = '';

  if (project.todos.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-message';
    empty.textContent = 'No todos yet. Add one above!';
    todoList.appendChild(empty);
    return;
  }

  project.todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority}${todo.complete ? ' done' : ''}`;

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.complete;
    check.className = 'todo-check';
    check.addEventListener('change', () => {
      app.toggleTodo(todo.id);
      render();
    });

    const info = document.createElement('div');
    info.className = 'todo-info';

    const title = document.createElement('span');
    title.className = 'todo-title';
    title.textContent = todo.title;

    const date = document.createElement('span');
    date.className = 'todo-date';
    date.textContent = formatDate(todo.dueDate);

    info.appendChild(title);
    if (todo.dueDate) info.appendChild(date);

    const badge = document.createElement('span');
    badge.className = `priority-badge ${todo.priority}`;
    badge.textContent = todo.priority;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.innerHTML = '&#9998;';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () => openModal(todo));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon danger';
    delBtn.innerHTML = '&times;';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', () => {
      app.deleteTodo(todo.id);
      render();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(check);
    li.appendChild(info);
    li.appendChild(badge);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
};

export const render = () => {
  renderProjects();
  renderTodos();
};

const openModal = (todo) => {
  document.getElementById('modal-id').value = todo.id;
  document.getElementById('modal-title').value = todo.title;
  document.getElementById('modal-description').value = todo.description;
  document.getElementById('modal-due').value = todo.dueDate;
  document.getElementById('modal-priority').value = todo.priority;
  document.getElementById('modal-notes').value = todo.notes || '';
  modal.classList.add('open');
  modalOverlay.classList.add('open');
};

const closeModal = () => {
  modal.classList.remove('open');
  modalOverlay.classList.remove('open');
};

document.getElementById('add-project-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('new-project-name');
  const name = input.value.trim();
  if (name) {
    app.addProject(name);
    input.value = '';
    render();
  }
});

document.getElementById('add-todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('new-todo-title').value.trim();
  const dueDateInput = document.getElementById('new-todo-due').value;
  const dueDate = dueDateInput || format(new Date(), 'yyyy-MM-dd');
  const priority = document.getElementById('new-todo-priority').value;
  if (title) {
    app.addTodo(title, '', dueDate, priority);
    document.getElementById('new-todo-title').value = '';
    document.getElementById('new-todo-due').value = '';
    document.getElementById('new-todo-priority').value = 'medium';
    render();
  }
});

document.getElementById('modal-save').addEventListener('click', () => {
  const id = document.getElementById('modal-id').value;
  app.updateTodo(id, {
    title: document.getElementById('modal-title').value.trim(),
    description: document.getElementById('modal-description').value.trim(),
    dueDate: document.getElementById('modal-due').value,
    priority: document.getElementById('modal-priority').value,
    notes: document.getElementById('modal-notes').value.trim(),
  });
  closeModal();
  render();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
