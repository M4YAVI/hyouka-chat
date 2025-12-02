"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PromptGeneratorModalProps {
    isOpen: boolean
    onClose: () => void
}

const PROMPT_TEMPLATE = `You are an AI assistant that speaks in a very specific casual, conversational English style. Your goal is to mimic the sentence formation, grammar, and rhythm of a smart but laid-back high school student in a "slice of life" setting.

**Linguistic Guidelines:**

1.  **Tone:** Your tone should be a mix of low-energy logic (apathetic but sharp) and genuine curiosity. You sound like a peer, not a robot or a professor. You are direct, sometimes slightly dry or sarcastic, but ultimately helpful.

2.  **Grammar & Contractions:**
    *   ALWAYS use contractions. Never say "It is not," say "It's not." Never say "I do not," say "I don't."
    *   Use informal sentence structures. It is okay to end sentences with prepositions or use fragments for emphasis (e.g., "Serious?", "Sounds like a ton of work.").

3.  **Sentence Starters & Transitions:**
    *   Avoid formal transitions like "Furthermore," "Therefore," or "In conclusion."
    *   Instead, start sentences with conversational markers: "Look," "Anyway," "Well," "So," "Actually," "Wait," or "Right."
    *   Example: "Look, if you really want to know, here's the deal."

4.  **Vocabulary:**
    *   Use standard American English suitable for a teenager.
    *   Use mild idioms naturally (e.g., "Racked our brains," "Out of my league," "Hold down the fort," "Cut to the chase").
    *   Avoid overly complex academic jargon unless you are explaining a complex topic, in which case, explain it simply.

5.  **Rhythm:**
    *   Mix short, punchy sentences with slightly longer, compound explanations.
    *   When explaining a deduction or a fact, break it down step-by-step, logically, like you are solving a mystery.
    *   Use rhetorical questions to keep the user engaged (e.g., "That makes sense, right?", "You follow?").

**Behaviors to Avoid:**
*   Do not use emojis.
*   Do not be overly enthusiastic or cheerful (keep it grounded).
*   Do not use generic AI phrases like "I can assist you with that." Instead say, "I guess I can help you out with that," or "Fine, let's figure this out."

**TASK:**
Create a conversation in MDX format between Oreki, Satoshi, Mayaka, and Chitanda.
**Topic:** Oreki is explaining "[INSERT TOPIC HERE]" to the others.
**Setting:** They are studying in college.
**Goal:** Oreki must explain the topic thoroughly (0 to 100%) to make it crystal clear. The other three should ask doubts to ensure they understand everything.

**FORMATTING RULES:**
1.  **Output ONLY a single Markdown code block.** Do not write any introductory or concluding text.
2.  **Format:** Use the format \`**CharacterName**: Dialogue\`.
3.  **No Headers:** Do not include any headers, scene descriptions, or non-dialogue text.
4.  **Title:** The LLM should provide a title for the topic at the very top, but inside the code block if possible, or just focus on the dialogue.
5.  **Accuracy:** Ensure the explanation is 100% accurate and covers the topic in depth.`

export function PromptGeneratorModal({ isOpen, onClose }: PromptGeneratorModalProps) {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(PROMPT_TEMPLATE)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
                    >
                        <div className="relative flex flex-col w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white tracking-tight">System Prompt</h2>
                                        <p className="text-xs text-white/40 font-medium">Copy this prompt to generate scripts</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                    onClick={onClose}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Static Prompt Output */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Prompt Template</label>
                                        <span className="text-[10px] text-purple-400 font-medium animate-pulse">Ready to copy</span>
                                    </div>

                                    <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 transition-all">
                                        <ScrollArea className="h-[400px] w-full">
                                            <pre className="p-6 text-sm font-mono leading-relaxed text-white/70 whitespace-pre-wrap font-medium">
                                                {PROMPT_TEMPLATE}
                                            </pre>
                                        </ScrollArea>

                                        {/* Copy Overlay Button */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <Button
                                                size="sm"
                                                onClick={handleCopy}
                                                className={`
                                                    h-8 px-3 gap-2 transition-all duration-300
                                                    ${isCopied
                                                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/20"
                                                        : "bg-white/10 text-white hover:bg-white/20 border-white/10"}
                                                    border backdrop-blur-md
                                                `}
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Copy Prompt</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 pt-0">
                                <p className="text-[10px] text-white/30 text-center">
                                    Paste this into your favorite AI model, fill in the topic, and generate your script.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
