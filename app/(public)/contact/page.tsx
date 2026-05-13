"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const faqs = [
  {
    q: "How do I become a seller?",
    a: "Register an account, go to your profile, and click 'Apply to Sell'.",
  },
  {
    q: "Is PubMarket available nationwide?",
    a: "Currently focused on Mindanao communities, expanding soon.",
  },
  {
    q: "How long does delivery take?",
    a: "Typically 1–3 days depending on your location and the seller.",
  },
  {
    q: "How do I report a seller?",
    a: "Use the Support page to submit a ticket. We review all reports within 24 hours.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground text-sm">
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            {sent ? (
              <div className="flex flex-col items-center py-8 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center">
                  <Send className="w-5 h-5 text-success-fg" />
                </div>
                <p className="font-semibold">Message Sent!</p>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSent(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold">Send a Message</h2>
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Juan dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="juan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="How can we help you?"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={() => setSent(true)}
                  disabled={!name || !email || !message}
                >
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-base font-semibold">Get in Touch</h2>
          {[
            {
              icon: <Mail className="w-4 h-4" />,
              label: "Email",
              value: "support@pubmarket.ph",
            },
            {
              icon: <Phone className="w-4 h-4" />,
              label: "Phone",
              value: "+63 (088) 123-4567",
            },
            {
              icon: <MapPin className="w-4 h-4" />,
              label: "Address",
              value: "Iligan City, Lanao del Norte, PH",
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-pm-green-100 text-pm-green-700 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">Business Hours</p>
            Mon–Fri: 8:00 AM – 5:00 PM
            <br />
            Sat: 9:00 AM – 12:00 PM
            <br />
            Sun: Closed
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <Card>
          <CardContent className="p-0">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
                {i < faqs.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
