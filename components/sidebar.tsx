"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Trash2, FileText, X, Menu } from "lucide-react"
import { getScriptsAction, deleteScriptAction } from "@/app/actions"
import type { Script } from "@/lib/chat-parser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  selectedId: string | null
  onSelect: (script: Script) => void
  onRefresh: number
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ selectedId, onSelect, onRefresh, isOpen, onToggle }: SidebarProps) {
  const [scripts, setScripts] = useState<Script[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchScripts = async () => {
      const dbScripts = await getScriptsAction()
      setScripts(dbScripts)
    }
    fetchScripts()
  }, [onRefresh])

  const filteredScripts = scripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await deleteScriptAction(id)
    const dbScripts = await getScriptsAction()
    setScripts(dbScripts)
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-black border-r border-white/10 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white tracking-tight">Script History</h2>
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/70 transition-colors" />
            <Input
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/5 text-white placeholder:text-white/30 focus:border-white/20 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {/* Scripts List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {filteredScripts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/20 py-8">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No scripts found</p>
              </motion.div>
            ) : (
              filteredScripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(script)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${selectedId === script.id
                    ? "bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/5"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate transition-colors ${selectedId === script.id ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                        {script.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-1 line-clamp-2">{script.content.slice(0, 80)}...</p>
                      <p className="text-[10px] text-white/20 mt-2 font-mono">{new Date(script.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 hover:bg-red-400/10 h-7 w-7"
                      onClick={(e) => handleDelete(e, script.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  )
}
