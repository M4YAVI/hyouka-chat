"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Menu, FileText } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ChatViewer } from "@/components/chat-viewer"
import { PromptGeneratorModal } from "@/components/prompt-generator-modal"
import { Button } from "@/components/ui/button"
import { saveScriptAction, getScriptsAction } from "@/app/actions"
import type { Script } from "@/lib/chat-parser"

// Default conversation string
const defaultConversationString = `oreki: I'm trying to conserve energy.
chitanda: I'm curious! I can't stop thinking about it.
satoshi: You can't escape her curiosity, Houtarou.
mayaka: Just give up and help her already.
oreki: Fine. But let's make it quick.
chitanda: Thank you! You are the best!`

export default function ChatVisualizationApp() {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  // Initialize with default script if none exist
  useEffect(() => {
    const initScripts = async () => {
      const scripts = await getScriptsAction()
      if (scripts.length === 0) {
        const defaultScript: Script = {
          id: crypto.randomUUID(),
          title: "Hyouka - Sample Conversation",
          content: defaultConversationString,
          createdAt: new Date().toISOString(),
        }
        await saveScriptAction(defaultScript)
        setSelectedScript(defaultScript)
        setRefreshTrigger((prev) => prev + 1)
      } else {
        setSelectedScript(scripts[0])
      }
    }
    initScripts()
  }, [])

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script)
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative flex h-screen">
        {/* Sidebar */}
        <Sidebar
          selectedId={selectedScript?.id || null}
          onSelect={handleScriptSelect}
          onRefresh={refreshTrigger}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-black">
          {/* Top Bar */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-white/10 bg-black z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all gap-2"
                onClick={() => setIsGeneratorOpen(true)}
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Copy Prompt</span>
              </Button>

              <Link href="/new">
                <Button className="bg-white text-black hover:bg-white/90 gap-2 font-medium">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Script</span>
                </Button>
              </Link>
            </div>
          </motion.header>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden bg-black">
            <div className="h-full max-w-3xl mx-auto">
              <ChatViewer content={selectedScript?.content || ""} title={selectedScript?.title || ""} />
            </div>
          </div>
        </main>
      </div>

      <PromptGeneratorModal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />
    </div>
  )
}
