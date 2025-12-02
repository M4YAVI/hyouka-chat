"use client"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChatMessage as ChatMessageType } from "@/lib/chat-parser"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"

interface ChatMessageProps {
  message: ChatMessageType
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex items-start gap-3 group"
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.15 + 0.1, type: "spring", stiffness: 200 }}
        className="relative shrink-0"
      >
        <div className="relative">
          <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-offset-black/50" style={{ "--ring-color": message.color } as React.CSSProperties}>
            <AvatarImage src={message.avatar} alt={message.name} className="object-cover" />
            <AvatarFallback
              className="text-white font-bold text-xs"
              style={{ backgroundColor: message.color }}
            >
              {message.initials}
            </AvatarFallback>
          </Avatar>

          {/* Status Indicator Dot */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black/50"
            style={{ backgroundColor: message.color }}
          />
        </div>

        {/* Ring Color Style Injection */}
        <style jsx global>{`
          .ring-offset-black\\/50 {
             --tw-ring-color: var(--ring-color);
          }
        `}</style>
      </motion.div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.2 }}
          className="text-xs font-medium mb-1 block"
          style={{ color: message.color }}
        >
          {message.name}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 + 0.25 }}
          className="relative"
        >
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg transition-colors duration-300 hover:bg-white/15"
            style={{ borderLeftColor: message.color, borderLeftWidth: "3px" }}
          >
            <div className="text-sm text-white/90 leading-relaxed markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {children}
                    </a>
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "")
                    const isInline = !match && !String(children).includes("\n")
                    return isInline ? (
                      <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-white/80" {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="my-2 rounded-md overflow-hidden bg-black/50 border border-white/10">
                        <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 text-xs text-white/40 font-mono">
                          {match ? match[1] : "code"}
                        </div>
                        <pre className="p-3 overflow-x-auto">
                          <code className={`text-xs font-mono text-white/90 ${className || ""}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    )
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-white/20 pl-3 my-2 italic text-white/60">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-white/90">{children}</li>,
                  table: ({ children }) => (
                    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
                      <table className="w-full text-left border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-white/10">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
                  tr: ({ children }) => <tr>{children}</tr>,
                  th: ({ children }) => <th className="px-3 py-2 text-xs font-semibold text-white/80 uppercase tracking-wider">{children}</th>,
                  td: ({ children }) => <td className="px-3 py-2 text-sm text-white/70">{children}</td>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                }}
              >
                {message.message}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
