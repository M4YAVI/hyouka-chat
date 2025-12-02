import { NextResponse } from "next/server"
import { getScriptById, updateScript, deleteScript } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const script = await getScriptById(id)

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error("Error fetching script:", error)
    return NextResponse.json({ error: "Failed to fetch script" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const script = await updateScript(id, title, content)

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error("Error updating script:", error)
    return NextResponse.json({ error: "Failed to update script" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteScript(id)

    if (!deleted) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting script:", error)
    return NextResponse.json({ error: "Failed to delete script" }, { status: 500 })
  }
}
