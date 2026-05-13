import { Store, Users, ShieldCheck, Truck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const team = [
  { name: "Maria Santos", role: "Founder & CEO", initials: "MS" },
  { name: "Carlos Reyes", role: "Head of Operations", initials: "CR" },
  { name: "Ana Gonzales", role: "Lead Developer", initials: "AG" },
  { name: "Roberto Lim", role: "Community Manager", initials: "RL" },
];
const values = [
  {
    icon: <Store className="w-5 h-5" />,
    title: "Support Local",
    desc: "We prioritize local farmers, artisans, and small businesses over big corporations.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Trust & Safety",
    desc: "All sellers are verified by our admin team before they can list products.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Community First",
    desc: "PubMarket is built around community — buyers and sellers who know each other.",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: "Fast & Fresh",
    desc: "Locally sourced means shorter delivery times and fresher products.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
      <section className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-pm-green-100 text-pm-green-700 flex items-center justify-center mx-auto">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold">About PubMarket</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
          PubMarket is a local marketplace platform designed to connect buyers
          directly with local farmers, food producers, artisans, and small shop
          owners — cutting out the middleman and keeping money in the local
          economy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-pm-green-100 text-pm-green-700 flex items-center justify-center flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-6 text-center">The Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center text-center gap-2"
            >
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-pm-green-50 border border-pm-green-200 p-8">
        <h2 className="text-xl font-bold text-center mb-6 text-pm-green-800">
          PubMarket by the Numbers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Registered Users", value: "1,284+" },
            { label: "Local Sellers", value: "87+" },
            { label: "Products Listed", value: "643+" },
            { label: "Orders Completed", value: "4,821+" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
