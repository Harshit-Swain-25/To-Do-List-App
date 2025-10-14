const STORAGE_KEY = 'todos-v1';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');
const filters = document.querySelectorAll('.filters button');
const clearBtn = document.getElementById('clear-completed');

function render() {
  const visible = todos.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.completed;
    return t.completed;
  });

  list.innerHTML = '';

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No tasks — add one!';
    empty.style.opacity = 0.7;
    empty.style.padding = '10px';
    list.appendChild(empty);
  } else {
    visible.forEach(t => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (t.completed ? ' completed' : '');
      li.dataset.id = t.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!t.completed;

      const span = document.createElement('div');
      span.className = 'text';
      span.textContent = t.text;
      span.tabIndex = 0;

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.title = 'Edit';
      editBtn.textContent = '✎';

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn delete';
      delBtn.title = 'Delete';
      delBtn.textContent = '✕';

      li.append(checkbox, span, editBtn, delBtn);
      list.appendChild(li);
    });
  }

  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;

  filters.forEach(f => f.classList.toggle('active', f.dataset.filter === filter));
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.unshift({ id: uid(), text: trimmed, completed: false });
  save();
  render();
}

function toggleComplete(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
  render();
}

function deleteTask(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function editTask(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  const newText = prompt('Edit task', t.text);
  if (newText === null) return;
  const trimmed = newText.trim();
  if (!trimmed) return alert('Task cannot be empty.');
  t.text = trimmed;
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.type === 'checkbox') {
    toggleComplete(id);
    return;
  }
  if (e.target.title === 'Delete') {
    deleteTask(id);
    return;
  }
  if (e.target.title === 'Edit') {
    editTask(id);
    return;
  }
  if (e.target.classList.contains('text')) {
    toggleComplete(id);
    return;
  }
});

filters.forEach(btn => btn.addEventListener('click', () => {
  filter = btn.dataset.filter;
  render();
}));

clearBtn.addEventListener('click', clearCompleted);

render();