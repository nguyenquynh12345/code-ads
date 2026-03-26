"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, MessageSquare, BarChart3, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function AIDataAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Chào bạn! Mình là AI Assistant. Bạn muốn biết gì về dữ liệu hôm nay?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let response = "Mình đang phân tích dữ liệu cho bạn...";
      const query = input.toLowerCase();

      if (query.includes("doanh thu") || query.includes("revenue")) {
        response = "Doanh thu hôm nay đạt ₫48.2M, tăng 8.1% so với hôm qua. Xu hướng đang rất tốt!";
      } else if (query.includes("người dùng") || query.includes("user")) {
        response = "Tổng số người dùng hiện tại là 12,450. Có 1,204 khách hàng mới trong 24 giờ qua.";
      } else if (query.includes("chiến dịch") || query.includes("campaign")) {
        response = "Chiến dịch 'Email Marketing' đang dẫn đầu với 35% tỉ lệ chuyển đổi.";
      } else {
        response = "Câu hỏi hay quá! Dựa trên dữ liệu hiện tại, mình thấy mọi chỉ số đều đang ổn định. Bạn muốn mình kiểm tra kỹ phần nào không?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="position-fixed bottom-0 btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0"
        style={{ 
          width: 60, 
          height: 60, 
          zIndex: 1060, 
          right: "90px", // Moved left to avoid StickyNotes
          bottom: "24px",
          border: "4px solid rgba(255,255,255,0.1)" 
        }}
      >

        <Bot size={28} />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '10px' }}>
          AI
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="position-fixed glass-card d-flex flex-column overflow-hidden shadow-2xl"
            style={{ 
              width: "380px", 
              height: "550px", 
              zIndex: 1070, 
              borderRadius: "24px",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              right: "90px", // Align with button
              bottom: "90px", // Just above the button
            }}
          >

            {/* Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-primary bg-opacity-10">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-20 p-2 rounded-3 text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>AI Insights</h6>
                  <span className="text-success fw-bold" style={{ fontSize: '0.65rem' }}>● Online</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="btn btn-sm btn-light rounded-circle p-1 opacity-75 hover-opacity-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div 
                    className={`p-3 rounded-4 shadow-sm ${
                      msg.sender === "user" 
                        ? "bg-primary text-white" 
                        : "bg-light bg-opacity-50 text-dark-emphasis border"
                    }`}
                    style={{ 
                      maxWidth: "85%", 
                      fontSize: "0.85rem",
                      borderTopRightRadius: msg.sender === "user" ? "4px" : "20px",
                      borderTopLeftRadius: msg.sender === "bot" ? "4px" : "20px",
                    }}
                  >
                    {msg.text}
                    <div className={`mt-1 opacity-50 ${msg.sender === "user" ? "text-end" : ""}`} style={{ fontSize: "0.6rem" }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="d-flex justify-content-start">
                  <div className="bg-light bg-opacity-50 p-2 px-3 rounded-4 border">
                    <div className="typing-dots d-flex gap-1">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Actions */}
            <div className="px-3 py-2 d-flex gap-2 overflow-auto no-scrollbar">
              {[
                { icon: <TrendingUp size={12} />, text: "Doanh thu" },
                { icon: <BarChart3 size={12} />, text: "Chiến dịch" },
                { icon: <MessageSquare size={12} />, text: "Gợi ý" },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(action.text); handleSend(); }}
                  className="btn btn-xs btn-outline-primary rounded-pill text-nowrap py-1 px-3 d-flex align-items-center gap-1"
                  style={{ fontSize: "0.7rem", borderWidth: '1px' }}
                >
                  {action.icon} {action.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-top">
              <div className="d-flex gap-2 bg-light bg-opacity-50 p-1 rounded-pill border">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Hỏi AI về dữ liệu..."
                  className="form-control border-0 shadow-none bg-transparent px-3 py-2"
                  style={{ fontSize: "0.85rem" }}
                />
                <button 
                  onClick={handleSend}
                  className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 38, height: 38 }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .dot {
          width: 4px;
          height: 4px;
          background: #6366f1;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
