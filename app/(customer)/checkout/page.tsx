"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  MapPin,
  ChevronDown,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  mockCartItems,
  mockCurrentUser,
} from "@/lib/mockup/pubMarket-data-mockup";

const DELIVERY_FEE = 49;

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const items = mockCartItems;
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/checkout/success");
    }, 1800);
  };

  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    cardName.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: ADDRESS + PAYMENT ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {mockCurrentUser.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockCurrentUser.location?.barangay},{" "}
                    {mockCurrentUser.location?.city},{" "}
                    {mockCurrentUser.location?.province}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockCurrentUser.phone}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-primary text-primary"
                >
                  Default
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary mt-1 h-7 px-0 flex items-center gap-1"
              >
                Change Address <ChevronDown className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Mock Payment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock PayMongo badge */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                Secured by{" "}
                <span className="font-semibold text-foreground">PayMongo</span>
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  Mock
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cardName" className="text-sm">
                    Name on Card
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="Juan dela Cruz"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-sm">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry" className="text-sm">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv" className="text-sm">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Any 16-digit number works — this is a mock payment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-4 space-y-4">
              <h2 className="font-semibold text-base">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.thumbnailUrl ?? "/placeholder.png"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity} · {item.product.unit}
                      </p>
                    </div>
                    <span className="text-xs font-semibold flex-shrink-0">
                      ₱{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₱{DELIVERY_FEE.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">₱{total.toFixed(2)}</span>
              </div>

              <Button
                className="w-full flex items-center gap-2"
                onClick={handlePay}
                disabled={!isValid || loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₱{total.toFixed(2)}
                  </>
                )}
              </Button>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                >
                  ← Back to Cart
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
