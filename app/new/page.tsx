"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveScriptAction } from "@/app/actions"
import type { Script } from "@/lib/chat-parser"

export default function NewScriptPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return

        setIsSaving(true)
        try {
            const script: Script = {
                id: crypto.randomUUID(),
                title: title.trim(),
                content: content.trim(),
                createdAt: new Date().toISOString(),
            }

            await saveScriptAction(script)
            router.push("/")
        } catch (error) {
            console.error("Failed to save script", error)
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto h-screen flex flex-col p-6 lg:p-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center justify-between mb-8"
                >
                    <Button
                        variant="ghost"
                        className="text-white/50 hover:text-white hover:bg-white/5 gap-2 pl-2 pr-4 rounded-full transition-all"
                        onClick={() => router.push("/")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Scripts</span>
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-white/40">
                            <Sparkles className="w-3 h-3 text-yellow-500/50" />
                            <span>Pro Editor</span>
                        </div>
                    </div>
                </motion.header>

                {/* Main Editor */}
                <motion.main
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="flex-1 flex flex-col gap-6 min-h-0"
                >
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Untitled Script..."
                            className="text-4xl md:text-5xl font-bold bg-transparent border-none px-0 placeholder:text-white/10 focus-visible:ring-0 h-auto tracking-tight"
                        />
                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] focus-within:bg-white/[0.04] focus-within:border-white/10 transition-all duration-300">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Write your dialogue here...\n\nExample:\n**Oreki**: I'm trying to conserve energy.\n**Chitanda**: I'm curious!`}
                            className="w-full h-full resize-none bg-transparent border-none focus-visible:ring-0 p-6 text-lg font-mono leading-relaxed text-white/80 placeholder:text-white/10"
                            spellCheck={false}
                        />
                        {/* Status Bar */}
                        <div className="absolute bottom-4 right-6 flex gap-4 text-xs font-medium text-white/20 pointer-events-none">
                            <span>Markdown Supported</span>
                            <span>LaTeX Supported</span>
                        </div>
                    </div>
                </motion.main>

                {/* Footer Actions */}
                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-end gap-4 mt-8"
                >
                    <Button
                        variant="ghost"
                        className="text-white/50 hover:text-white hover:bg-white/5"
                        onClick={() => router.push("/")}
                    >
                        Discard
                    </Button>
                    <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 px-8 rounded-xl font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
                        onClick={handleSave}
                        disabled={!title.trim() || !content.trim() || isSaving}
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Script
                            </>
                        )}
                    </Button>
                </motion.footer>
            </div>
        </div>
    )
}
