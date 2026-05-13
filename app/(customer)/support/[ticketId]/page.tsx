// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/support/[ticketId]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockSupportTickets,
  mockSupportMessages,
} from "@/lib/mockup/pubMarket-data-mockup";
import { cn } from "@/lib/utils/cn";

const ticketStatusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-pm-gold-100 text-pm-gold-800" },
  in_progress: {
    label: "In Progress",
    color: "bg-pm-green-100 text-pm-green-800",
  },
  resolved: { label: "Resolved", color: "bg-success-bg text-success-fg" },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground" },
};

export default function TicketDetailPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticket = mockSupportTickets[0];
  const [messages, setMessages] = useState(mockSupportMessages);
  const [reply, setReply] = useState("");
  const config = ticketStatusConfig[ticket.status];

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `smsg-${Date.now()}`,
        ticketId: ticket.id,
        body: reply,
        isStaff: false,
        createdAt: new Date().toISOString(),
        sender: { id: "user-001", fullName: "Juan dela Cruz", avatarUrl: null },
      },
    ]);
    setReply("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/support">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{ticket.subject}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {ticket.category.replace("_", " ")}
          </p>
        </div>
        <Badge
          className={`text-[10px] px-2 py-0.5 border-0 flex-shrink-0 ${config.color}`}
        >
          {config.label}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2", !msg.isStaff && "flex-row-reverse")}
          >
            <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
              <AvatarFallback
                className={cn(
                  "text-xs",
                  msg.isStaff ? "bg-primary text-white" : "bg-muted",
                )}
              >
                {msg.isStaff ? "PM" : msg.sender.fullName[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "max-w-[75%] rounded-xl px-3 py-2 text-sm",
                msg.isStaff
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {msg.isStaff && (
                <p className="text-[10px] font-semibold mb-0.5 text-muted-foreground">
                  PubMarket Support
                </p>
              )}
              <p>{msg.body}</p>
              <p
                className={cn(
                  "text-[10px] mt-1",
                  msg.isStaff
                    ? "text-muted-foreground"
                    : "text-primary-foreground/70",
                )}
              >
                {new Date(msg.createdAt).toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply */}
      {ticket.status !== "closed" && (
        <div className="flex gap-2">
          <Input
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
            className="flex-1"
          />
          <Button size="icon" onClick={sendReply} disabled={!reply.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
