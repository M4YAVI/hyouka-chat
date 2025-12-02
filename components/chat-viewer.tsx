"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage } from "./chat-message"
import { parseConversation } from "@/lib/chat-parser"
import { MessageSquare } from "lucide-react"

interface ChatViewerProps {
  content: string
  title: string
}

export function ChatViewer({ content, title }: ChatViewerProps) {
  const messages = parseConversation(content)

  if (!content || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white/20"
        >
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium tracking-tight">No conversation selected</p>
          <p className="text-sm mt-1 opacity-50">Select a script or create a new one</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-sm z-10"
      >
        <h2 className="text-lg font-semibold text-white truncate tracking-tight">{title}</h2>
        <p className="text-xs text-white/40 mt-0.5 font-mono">{messages.length} messages</p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
