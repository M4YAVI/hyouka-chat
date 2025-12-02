import type { Script } from "./chat-parser"

const STORAGE_KEY = "chat-visualization-scripts"

export function getScripts(): Script[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveScript(script: Script): void {
  const scripts = getScripts()
  scripts.unshift(script)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts))
}

export function deleteScript(id: string): void {
  const scripts = getScripts().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts))
}

export function getScriptById(id: string): Script | undefined {
  return getScripts().find((s) => s.id === id)
}
