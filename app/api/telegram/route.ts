import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client with service role for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

// Extract session ID from a message that contains it
function extractSessionId(text: string): string | null {
  // Match session ID pattern: visitor_timestamp_randomstring
  const match = text.match(/visitor_\d+_[a-z0-9]+/i);
  return match ? match[0] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text;
    const replyToMessage = message.reply_to_message;

    // Check if this is the admin replying to a chat message
    if (
      chatId?.toString() === TELEGRAM_ADMIN_CHAT_ID &&
      replyToMessage?.text &&
      text
    ) {
      // Extract session ID from the original message
      const sessionId = extractSessionId(replyToMessage.text);

      if (sessionId) {
        // Save admin's reply to database
        const { error } = await supabase.from("chat_messages").insert({
          session_id: sessionId,
          sender: "admin",
          message: text,
        });

        if (error) {
          console.error("Error saving admin reply:", error);
          await sendTelegramMessage(chatId, "❌ Failed to save reply to database.");
        } else {
          // Confirm the reply was sent
          await sendTelegramMessage(chatId, "✅ Reply sent to visitor!");
        }

        return NextResponse.json({ ok: true });
      }
    }

    // Handle direct messages (not replies) - you can customize this behavior
    if (text && chatId?.toString() === TELEGRAM_ADMIN_CHAT_ID) {
      // Admin is messaging directly, show help
      if (text.toLowerCase() === "/start" || text.toLowerCase() === "/help") {
        await sendTelegramMessage(
          chatId,
          "👋 *Portfolio Chat Bot*\n\n" +
            "When visitors send messages from your website, they'll appear here.\n\n" +
            "*To reply:* Simply reply to any visitor message, and your response will be sent back to them on the website.\n\n" +
            "*Commands:*\n" +
            "/chats - View active conversations\n" +
            "/help - Show this help message",
          "Markdown"
        );
        return NextResponse.json({ ok: true });
      }

      if (text.toLowerCase() === "/chats") {
        // List recent conversations
        const { data: conversations } = await supabase
          .from("chat_conversations")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(10);

        if (conversations && conversations.length > 0) {
          const list = conversations
            .map(
              (c, i) =>
                `${i + 1}. *${c.visitor_name || "Anonymous"}*\n   Session: \`${c.session_id}\``
            )
            .join("\n\n");

          await sendTelegramMessage(
            chatId,
            `📋 *Recent Conversations*\n\n${list}`,
            "Markdown"
          );
        } else {
          await sendTelegramMessage(chatId, "No conversations yet.");
        }
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false });
  }
}

async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  parseMode?: string
) {
  if (!TELEGRAM_BOT_TOKEN) return;

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }),
    }
  );
}
