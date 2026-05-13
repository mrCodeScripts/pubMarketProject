// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/support/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockSupportTickets } from "@/lib/mockup/pubMarket-data-mockup";

const faqs = [
  {
    q: "How do I track my order?",
    a: "Go to Orders → select your order → tap 'Track on Map' when status is Out for Delivery.",
  },
  {
    q: "How do I become a seller?",
    a: "Go to your profile and tap 'Apply to Sell'. Submit your business info and BIR document for admin review.",
  },
  {
    q: "Is my payment secure?",
    a: "PubMarket uses mock PayMongo integration. No real charges are made during this demo.",
  },
  {
    q: "How do I cancel an order?",
    a: "You can cancel orders that are still in 'Pending' status from the order detail page.",
  },
  {
    q: "How do I leave a review?",
    a: "After your order is delivered, go to the order detail page and tap 'Leave Review'.",
  },
];

const ticketStatusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-pm-gold-100 text-pm-gold-800" },
  in_progress: {
    label: "In Progress",
    color: "bg-pm-green-100 text-pm-green-800",
  },
  resolved: { label: "Resolved", color: "bg-success-bg text-success-fg" },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground" },
};

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold">Help & Support</h1>

      {/* FAQ */}
      <section>
        <h2 className="text-base font-semibold mb-3">
          Frequently Asked Questions
        </h2>
        <Card>
          <CardContent className="p-0">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium pr-3">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3.5">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
                {i < faqs.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Submit Ticket */}
      <section>
        <h2 className="text-base font-semibold mb-3">Submit a Ticket</h2>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center gap-2"
              disabled={!subject || !message}
            >
              <Plus className="w-4 h-4" /> Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* My Tickets */}
      <section>
        <h2 className="text-base font-semibold mb-3">My Tickets</h2>
        <div className="space-y-2">
          {mockSupportTickets.map((ticket) => {
            const config = ticketStatusConfig[ticket.status];
            return (
              <Link key={ticket.id} href={`/support/${ticket.id}`}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {ticket.category.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border-0 ${config.color}`}
                      >
                        {config.label}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
export { SupportPage as default };
