export interface ChatMessage {
  id: string
  name: string
  message: string
  avatar?: string
  initials: string
  color: string
}

export interface Script {
  id: string
  title: string
  content: string
  createdAt: string
}

// Character configuration with known avatars
const knownCharacters: Record<string, { avatar: string }> = {
  oreki: { avatar: "/oreki.jpg" },
  chitanda: { avatar: "/chitanda.jpg" },
  satoshi: { avatar: "/satoshi.jpg" },
  mayaka: { avatar: "/mayaka.jpg" },
}

// A palette of cool, vibrant colors for generated characters
const colorPalette = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#84cc16", // lime-500
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#d946ef", // fuchsia-500
  "#f43f5e", // rose-500
]

function generateColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colorPalette.length
  return colorPalette[index]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function parseConversation(conversationString: string): ChatMessage[] {
  // Remove YAML frontmatter if present
  const content = conversationString.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/, "")

  const lines = content.trim().split("\n")
  const messages: ChatMessage[] = []

  let currentMessage: Partial<ChatMessage> | null = null
  let currentMessageLines: string[] = []

  const finalizeCurrentMessage = () => {
    if (currentMessage && currentMessageLines.length > 0) {
      let fullMessage = currentMessageLines.join("\n").trim()

      // Normalize LaTeX delimiters
      // 1. Handle \[ ... \] -> $$ ... $$ (Standard LaTeX block)
      fullMessage = fullMessage.replace(/\\\[([\s\S]*?)\\\]/g, "$$$$$1$$$$")
      // 2. Handle \( ... \) -> $ ... $ (Standard LaTeX inline)
      fullMessage = fullMessage.replace(/\\\(([\s\S]*?)\\\)/g, "$$$1$$")
      // 3. Smart handle [ ... ] -> $ ... $ (Non-standard, treat as INLINE to be safe)
      fullMessage = fullMessage.replace(/\[([\s\S]*?)\]/g, (match, content, offset, string) => {
        if (string[offset + match.length] === '(') return match // Markdown link
        if (content.includes("\\") || content.includes("=") || content.includes("^") || content.includes("_")) {
          return `$${content}$`
        }
        return match
      })
      // 4. Smart handle ( ... ) -> $ ... $ (Non-standard inline)
      fullMessage = fullMessage.replace(/\(([\s\S]*?)\)/g, (match, content) => {
        if (content.includes("(") || content.includes(")")) return match
        if (content.includes("\\")) return `$${content}$`
        return match
      })

      messages.push({
        ...currentMessage,
        message: fullMessage,
      } as ChatMessage)
      currentMessage = null
      currentMessageLines = []
    }
  }

  lines.forEach((line, index) => {
    // Robust Speaker Detection Regex
    // Matches:
    // 1. **Name**: Message
    // 2. Name: Message
    // 3. **Name** Message (No colon, but bolded name)
    const speakerMatch = line.match(/^(\*\*([^*]+)\*\*|([a-zA-Z0-9\s]+))(:)?\s+(.*)/)

    let isNewSpeaker = false
    let rawName = ""
    let initialMessage = ""

    if (speakerMatch) {
      const boldName = speakerMatch[2]
      const plainName = speakerMatch[3]
      const hasColon = speakerMatch[4] === ":"
      const messageContent = speakerMatch[5]

      // Determine if it's a valid speaker line
      if (boldName) {
        // **Name** case (with or without colon) - Strong signal
        isNewSpeaker = true
        rawName = boldName.trim()
        initialMessage = messageContent
      } else if (plainName && hasColon) {
        // Name: case - Strong signal
        // Filter out common false positives like "Note:", "Warning:", "Tip:" if needed, but for now we accept them as speakers or user can escape them
        isNewSpeaker = true
        rawName = plainName.trim()
        initialMessage = messageContent
      }
    }

    if (isNewSpeaker) {
      finalizeCurrentMessage()

      const lowerName = rawName.toLowerCase()
      const knownChar = knownCharacters[lowerName]

      // Use known avatar or generate initials
      const avatar = knownChar?.avatar
      const color = generateColor(lowerName)

      // Format name: Capitalize words
      const displayName = rawName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

      currentMessage = {
        id: `msg-${messages.length}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: displayName,
        avatar,
        initials: getInitials(displayName),
        color,
      }

      if (initialMessage) {
        currentMessageLines.push(initialMessage)
      }
    } else {
      // Not a new speaker, append to current message
      if (currentMessage) {
        currentMessageLines.push(line)
      } else {
        // Orphaned lines at the start (before any speaker)
        // We can either ignore them or treat them as a "System" or "Narrator" message
        // For now, let's create a default "Narrator" if lines exist before any speaker
        if (line.trim()) {
          currentMessage = {
            id: `msg-narrator-${Date.now()}`,
            name: "Narrator",
            initials: "N",
            color: "#64748b", // Slate-500
          }
          currentMessageLines.push(line)
        }
      }
    }
  })

  finalizeCurrentMessage()

  return messages
}

export function getCharacterColor(name: string): string {
  return generateColor(name.toLowerCase())
}
