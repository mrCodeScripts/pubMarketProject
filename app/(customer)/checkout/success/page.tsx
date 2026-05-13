// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/checkout/success/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CheckoutSuccessPage() {
  const mockOrderId = "order-003";
  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success-fg" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Order Placed!</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your order has been successfully placed. The seller will confirm it
          shortly.
        </p>
      </div>
      <Card className="w-full text-left">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-medium">{mockOrderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-medium text-success-fg">Paid (Mock)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="font-medium">2–4 business days</span>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link href={`/orders/${mockOrderId}/track`} className="flex-1">
          <Button className="w-full flex items-center gap-2">
            <Package className="w-4 h-4" /> Track Order
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default CheckoutSuccessPage;
