import { readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'tasks.json');
const backupPath = path.join(process.cwd(), 'tasks.json.bak');

export async function readTasks() {
  let raw;
  try { raw = await readFile(filePath, 'utf-8'); } 
  catch (err) {
    if (err.code === 'ENOENT') { await writeTasks([]); return []; }
    if (err.code === 'EACCES') throw new Error('Нет прав на чтение tasks.json');
    throw new Error(`Ошибка чтения: ${err.message}`);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('ожидался массив');
    return parsed;
  } catch (err) { throw new Error(`Файл повреждён: ${err.message}`); }
}

export async function writeTasks(tasks) {
  if (!Array.isArray(tasks)) throw new Error('writeTasks: нужен массив');
  try { await copyFile(filePath, backupPath); } catch (err) { if (err.code !== 'ENOENT') console.error('Ошибка бэкапа:', err.message); }
  try { await writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8'); } 
  catch (err) { throw new Error(`Ошибка записи: ${err.message}`); }
}