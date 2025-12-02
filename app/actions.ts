'use server'

import { pool } from '@/lib/db'
import { Script } from '@/lib/chat-parser'
import { revalidatePath } from 'next/cache'

export async function saveScriptAction(script: Script) {
    try {
        const client = await pool.connect()
        try {
            await client.query(
                'INSERT INTO scripts (id, title, content, created_at) VALUES ($1, $2, $3, $4)',
                [script.id, script.title, script.content, script.createdAt]
            )
        } finally {
            client.release()
        }
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to save script:', error)
        return { success: false, error: 'Failed to save script' }
    }
}

export async function getScriptsAction(): Promise<Script[]> {
    try {
        const client = await pool.connect()
        try {
            const result = await client.query('SELECT * FROM scripts ORDER BY created_at DESC')
            return result.rows.map(row => ({
                id: row.id,
                title: row.title,
                content: row.content,
                createdAt: row.created_at.toISOString()
            }))
        } finally {
            client.release()
        }
    } catch (error) {
        console.error('Failed to fetch scripts:', error)
        return []
    }
}

export async function deleteScriptAction(id: string) {
    try {
        const client = await pool.connect()
        try {
            await client.query('DELETE FROM scripts WHERE id = $1', [id])
        } finally {
            client.release()
        }
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete script:', error)
        return { success: false, error: 'Failed to delete script' }
    }
}
