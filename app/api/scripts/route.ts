import { NextResponse } from "next/server"
import { getAllScripts, createScript, searchScripts } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    const scripts = query ? await searchScripts(query) : await getAllScripts()

    return NextResponse.json(scripts)
  } catch (error) {
    console.error("Error fetching scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const script = await createScript(title, content)

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error("Error creating script:", error)
    return NextResponse.json({ error: "Failed to create script" }, { status: 500 })
  }
}
