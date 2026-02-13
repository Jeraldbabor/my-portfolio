import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create admin client with service role for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8577940208:AAGdfDqI6DsVGtunohs-8dLLatF_jXOzkW4";
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || "5857296374";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are Jerald Babor's AI assistant on his portfolio website. Jerald is a full-stack software engineer specializing in JavaScript, Python, TypeScript, React, Next.js, and PHP. He works on web applications, mobile apps, SEO, and AI-powered solutions.

Key facts about Jerald:
- Based in Negros Occidental, Philippines
- Passionate about AI, web development, and helping developers grow
- Has helped startups and MSMEs streamline their processes through software
- Built a community of developers sharing knowledge and mentorship
- Currently focusing on integrating AI tools into modern applications

Your role:
- Be friendly, professional, and helpful
- Answer questions about programming, web development, and tech
- If asked to schedule a call or meeting, suggest they use the "Schedule a Call" button on the website
- If asked about specific projects or services, provide general info and offer to have Jerald follow up
- Keep responses concise but informative (2-4 sentences max)
- If you don't know something specific about Jerald, say you'll have him follow up personally

Always be warm and approachable. Use casual but professional language.`;

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
    let telegramStatus = "skipped";
    let telegramError = null;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      const telegramMessage = isSystemMessage
        ? `🆕 New Chat Started\n\n👤 From: ${visitorName || "Anonymous"}\n🔑 Session: ${sessionId}`
        : `💬 New Message\n\n👤 From: ${visitorName || "Anonymous"}\n📝 Message: ${message}\n\n🔑 Session: ${sessionId}\n\nReply to this message to respond`;

      try {
        const telegramRes = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_ADMIN_CHAT_ID,
              text: telegramMessage,
            }),
          }
        );
        const telegramData = await telegramRes.json();
        if (!telegramData.ok) {
          console.error("Telegram API error:", telegramData);
          telegramStatus = "api_error";
          telegramError = telegramData.description || JSON.stringify(telegramData);
        } else {
          telegramStatus = "sent";
        }
      } catch (err: unknown) {
        console.error("Error sending to Telegram:", err);
        telegramStatus = "fetch_error";
        telegramError = err instanceof Error ? err.message : String(err);
      }
    } else {
      telegramStatus = "no_env_vars";
      telegramError = `BOT_TOKEN=${TELEGRAM_BOT_TOKEN ? "set" : "missing"}, CHAT_ID=${TELEGRAM_ADMIN_CHAT_ID ? "set" : "missing"}`;
    }

    // Generate AI auto-reply (skip for system messages)
    if (!isSystemMessage) {
      let aiReplyText = "Thanks for your message! Jerald will get back to you soon. Feel free to explore the portfolio or schedule a call! 😊";

      if (process.env.GEMINI_API_KEY) {
        try {
          // Get recent chat history for context
          const { data: chatHistory } = await supabase
            .from("chat_messages")
            .select("sender, message")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true })
            .limit(10);

          // Build conversation context
          const conversationHistory = (chatHistory || [])
            .filter(m => !m.message.startsWith("[New chat started"))
            .map(m => `${m.sender === "visitor" ? "User" : "Assistant"}: ${m.message}`)
            .join("\n");

          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const prompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationHistory}\n\nRespond to the user's latest message naturally and helpfully.`;

          // Add timeout to prevent Vercel function timeout
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });
          clearTimeout(timeout);

          const response = result.response;
          const aiResponse = response.text();

          if (aiResponse && aiResponse.trim()) {
            aiReplyText = aiResponse.trim();
          }
        } catch (aiError) {
          console.error("Error generating AI response:", aiError);
          // Use fallback message (already set above)
        }
      }

      // Always save a reply to the database
      try {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          conversation_id: conversation?.id,
          sender: "admin",
          message: aiReplyText,
        });
      } catch (dbError) {
        console.error("Error saving AI reply:", dbError);
      }
    }

    return NextResponse.json({ success: true, message: savedMessage, telegram: { status: telegramStatus, error: telegramError } });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
