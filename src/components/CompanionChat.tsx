"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { chatWithCompanion } from "@/app/actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "companion";
  content: string;
};

export function CompanionChat() {
  const userId = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "companion",
      content: "Hi there. I'm your wellness companion. How are you feeling today? I'm here to listen, without judgment.",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !userId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const responseText = await chatWithCompanion(userId, userMessage, history);

    setMessages(prev => [...prev, { id: Date.now().toString(), role: "companion", content: responseText }]);
    setIsLoading(false);
  };

  return (
    <Card className="glass h-[600px] flex flex-col max-w-4xl mx-auto border-white/10 shadow-2xl">
      <CardHeader className="border-b border-white/5 bg-black/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              AI Wellness Coach <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Always here for you, 24/7.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-full p-4">
          <div className="space-y-6 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8 border border-white/10 mt-1">
                      {msg.role === "user" ? (
                        <>
                          <AvatarFallback className="bg-secondary text-secondary-foreground"><User className="h-4 w-4" /></AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback className="bg-primary/20 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-black/40 border border-white/5 rounded-tl-sm text-white/90"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="flex gap-3 max-w-[80%]">
                     <Avatar className="h-8 w-8 border border-white/10 mt-1">
                       <AvatarFallback className="bg-primary/20 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                     </Avatar>
                     <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/5 rounded-tl-sm text-white/90 flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin text-primary" />
                       <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
                     </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-white/5 bg-black/10">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-black/20 border-white/10 focus-visible:ring-primary/50"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </CardFooter>
    </Card>
  );
}
