import readline from 'node:readline';
import { readTasks, writeTasks } from './storage.js';
import { STATUSES, createTask, findTaskById, updateTaskStatus, deleteTask, filterTasksByStatus, formatTasks } from './taskService.js';

const MENU = `\n=== Менеджер задач ===\n1. Добавить задачу\n2. Просмотреть все задачи\n3. Изменить статус задачи\n4. Удалить задачу\n5. Фильтр по статусу\n6. Выход\n`;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (text) => new Promise((resolve) => rl.question(text, resolve));

async function handleAddTask() {
  const title = (await ask('Название задачи: ')).trim();
  if (!title) return console.log('Ошибка: название пустое.');
  const description = (await ask('Описание (необязательно): ')).trim();
  const tasks = await readTasks();
  const updated = createTask(tasks, title, description);
  await writeTasks(updated);
  console.log(`Задача "${updated[updated.length - 1].title}" создана.`);
}

async function handleViewTasks() {
  console.log('\n' + formatTasks(await readTasks()));
}

async function handleUpdateStatus() {
  const id = (await ask('Введите id задачи: ')).trim();
  let tasks = await readTasks();
  if (!findTaskById(tasks, id)) return console.log('Задача не найдена.');
  STATUSES.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  const status = STATUSES[Number((await ask('Выберите статус: ')).trim()) - 1];
  if (!status) return console.log('Ошибка статуса.');
  tasks = updateTaskStatus(tasks, id, status);
  await writeTasks(tasks);
  console.log('Статус изменён.');
}

async function handleDeleteTask() {
  const id = (await ask('Введите id задачи: ')).trim();
  let tasks = await readTasks();
  const task = findTaskById(tasks, id);
  if (!task) return console.log('Задача не найдена.');
  if ((await ask(`Удалить "${task.title}"? (y/n): `)).trim().toLowerCase() === 'y') {
    await writeTasks(deleteTask(tasks, id));
    console.log('Удалено.');
  }
}

async function handleFilter() {
  const tasks = await readTasks();
  if (!tasks.length) return console.log('Список задач пуст.');
  STATUSES.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  const status = STATUSES[Number((await ask('Статус: ')).trim()) - 1];
  if (!status) return console.log('Ошибка статуса.');
  console.log('\n' + formatTasks(filterTasksByStatus(tasks, status)));
}

async function main() {
  while (true) {
    console.log(MENU);
    const choice = (await ask('Выберите действие (1–6): ')).trim();
    try {
      if (choice === '1') await handleAddTask();
      else if (choice === '2') await handleViewTasks();
      else if (choice === '3') await handleUpdateStatus();
      else if (choice === '4') await handleDeleteTask();
      else if (choice === '5') await handleFilter();
      else if (choice === '6') { console.log('До свидания!'); process.exit(0); }
      else console.log('Неверный пункт.');
    } catch (err) { console.error(`Ошибка: ${err.message}`); }
  }
}
main();