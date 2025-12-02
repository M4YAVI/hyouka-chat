import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Script {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export async function getAllScripts(): Promise<Script[]> {
  const { rows } = await pool.query('SELECT * FROM scripts ORDER BY created_at DESC');
  return rows;
}

export async function getScriptById(id: string): Promise<Script | null> {
  const { rows } = await pool.query('SELECT * FROM scripts WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createScript(title: string, content: string): Promise<Script> {
  const { rows } = await pool.query(
    'INSERT INTO scripts (title, content) VALUES ($1, $2) RETURNING *',
    [title, content]
  );
  return rows[0];
}

export async function updateScript(id: string, title: string, content: string): Promise<Script | null> {
  const { rows } = await pool.query(
    'UPDATE scripts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return rows[0] || null;
}

export async function deleteScript(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM scripts WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export async function searchScripts(query: string): Promise<Script[]> {
  const { rows } = await pool.query(
    `SELECT * FROM scripts 
     WHERE title ILIKE $1 OR content ILIKE $1 
     ORDER BY created_at DESC`,
    [`%${query}%`]
  );
  return rows;
}

export default pool;
