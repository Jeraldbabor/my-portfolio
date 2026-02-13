"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface Message {
  id: string;
  sender: "visitor" | "admin";
  message: string;
  created_at: string;
}

function generateSessionId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [visitorName, setVisitorName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("chat_session_id");
    const storedName = localStorage.getItem("chat_visitor_name");
    if (stored) {
      setSessionId(stored);
      setHasStarted(true);
    } else {
      setSessionId(generateSessionId());
    }
    if (storedName) {
      setVisitorName(storedName);
    }
  }, []);

  // Fetch messages when chat is opened
  const fetchMessages = useCallback(async () => {
    if (!sessionId || !hasStarted) return;

    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        const newMessages = data.messages || [];
        setMessages((prevMessages) => {
          // Hide typing indicator if new admin message arrived
          const hasNewAdminMessage = newMessages.some(
            (m: Message) => m.sender === "admin" && !prevMessages.some((old) => old.id === m.id)
          );
          if (hasNewAdminMessage) {
            setShowTyping(false);
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [sessionId, hasStarted]);

  // Fetch messages on open and poll for new messages
  useEffect(() => {
    if (isOpen && hasStarted) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, hasStarted, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && hasStarted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasStarted]);

  const startChat = async () => {
    if (!visitorName.trim()) return;

    localStorage.setItem("chat_session_id", sessionId);
    localStorage.setItem("chat_visitor_name", visitorName.trim());
    setHasStarted(true);

    // Send initial greeting
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName: visitorName.trim(),
          message: `[New chat started by ${visitorName.trim()}]`,
          isSystemMessage: true,
        }),
      });
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // Optimistically add message
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      sender: "visitor",
      message: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName,
          message: messageText,
        }),
      });

      if (res.ok) {
        // Show typing indicator while waiting for AI response
        setShowTyping(true);
        // Fetch messages after a short delay to get the AI response
        setTimeout(async () => {
          await fetchMessages();
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasStarted) {
        sendMessage();
      } else {
        startChat();
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 shadow-lg transition-all hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <span className="font-medium">Chat with Jerald</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
            <Image
              src="/jerald1.png"
              alt="Jerald Babor"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div className="flex-1">
              <h3 className="font-semibold">Chat with Jerald</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Online
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-[350px] overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950">
            {!hasStarted ? (
              // Name input screen
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <Image
                  src="/jerald1.png"
                  alt="Jerald Babor"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-200 dark:border-blue-800"
                />
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Hi there! 👋
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Thanks for visiting my website. Feel free to ask me anything about programming, web development, or my experiences in tech.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-2">
                  What&apos;s your name?
                </p>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={startChat}
                  disabled={!visitorName.trim()}
                  className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium text-sm transition-colors"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              // Messages
              <>
                {/* Welcome message */}
                <div className="flex gap-2">
                  <Image
                    src="/jerald1.png"
                    alt="Jerald Babor"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%] shadow-sm">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Hi {visitorName}! 👋 Thanks for reaching out. I&apos;ll reply as soon as I can. If I&apos;m not available immediately, I&apos;ll get back to you via this chat!
                    </p>
                  </div>
                </div>

                {messages.filter(m => !m.message.startsWith("[New chat started")).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === "visitor" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.sender === "admin" && (
                      <Image
                        src="/jerald1.png"
                        alt="Jerald Babor"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                        msg.sender === "visitor"
                          ? "bg-blue-600 text-white rounded-tr-md"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-md"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "visitor" ? "text-blue-100" : "text-zinc-400"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Typing Indicator */}
                {showTyping && (
                  <div className="flex gap-2">
                    <Image
                      src="/jerald1.png"
                      alt="Jerald Babor"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {hasStarted && (
            <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 text-center">
                Ask me about programming, web dev, or tech!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
