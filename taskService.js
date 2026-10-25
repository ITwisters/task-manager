import { randomUUID } from 'node:crypto';

export const STATUSES = ['todo', 'in_progress', 'done'];
const COLORS = { todo: '\x1b[90m', in_progress: '\x1b[33m', done: '\x1b[32m' };
const RESET = '\x1b[0m';

export function isValidStatus(status) { return STATUSES.includes(status); }

export function createTask(tasks, title, description = '') {
  if (!title || !title.trim()) throw new Error('Название не может быть пустым');
  const now = new Date().toISOString();
  return [...tasks, { id: randomUUID(), title: title.trim(), description: description.trim(), status: 'todo', createdAt: now, updatedAt: now }];
}

export function findTaskById(tasks, id) { return tasks.find((t) => t.id === id); }

export function updateTaskStatus(tasks, id, status) {
  if (!isValidStatus(status)) throw new Error(`Недопустимый статус: ${status}`);
  let found = false;
  const updated = tasks.map((t) => {
    if (t.id !== id) return t;
    found = true;
    return { ...t, status, updatedAt: new Date().toISOString() };
  });
  if (!found) throw new Error(`Задача не найдена`);
  return updated;
}

export function deleteTask(tasks, id) {
  if (!tasks.some((t) => t.id === id)) throw new Error(`Задача не найдена`);
  return tasks.filter((t) => t.id !== id);
}

export function filterTasksByStatus(tasks, status) {
  if (!isValidStatus(status)) throw new Error(`Недопустимый статус: ${status}`);
  return tasks.filter((t) => t.status === status);
}

export function formatTasks(tasks) {
  if (!tasks.length) return 'Список задач пуст.';
  return tasks.map((t) => {
    const color = COLORS[t.status] || '';
    return `[${t.id}]\nНазвание : ${t.title}\nОписание : ${t.description || '—'}\nСтатус   : ${color}${t.status}${RESET}\nСоздано  : ${t.createdAt}\nОбновлено: ${t.updatedAt}`;
  }).join('\n\n');
}