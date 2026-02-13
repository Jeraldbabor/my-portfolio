import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client with service role for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

// GET - Retrieve messages for a session
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  try {
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ messages: [] });
  }
}

// POST - Send a new message
export async function POST(req: Request) {
  try {
    const { sessionId, visitorName, message, isSystemMessage } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message required" },
        { status: 400 }
      );
    }

    // Create or get conversation
    const { data: conversation } = await supabase
      .from("chat_conversations")
      .upsert(
        {
          session_id: sessionId,
          visitor_name: visitorName || "Anonymous",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      )
      .select()
      .single();

    // Save message to database
    const { data: savedMessage, error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        conversation_id: conversation?.id,
        sender: "visitor",
        message: message,
      })
      .select()
      .single();

    if (messageError) {
      console.error("Error saving message:", messageError);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    // Send to Telegram admin
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      const telegramMessage = isSystemMessage
        ? `🆕 *New Chat Started*\n\n👤 *From:* ${visitorName || "Anonymous"}\n🔑 *Session:* \`${sessionId}\``
        : `💬 *New Message*\n\n👤 *From:* ${visitorName || "Anonymous"}\n📝 *Message:* ${message}\n\n🔑 *Session:* \`${sessionId}\`\n\n_Reply to this message to respond_`;

      try {
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_ADMIN_CHAT_ID,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          }
        );
      } catch (telegramError) {
        console.error("Error sending to Telegram:", telegramError);
        // Don't fail the request if Telegram fails
      }
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
