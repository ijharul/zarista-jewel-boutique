import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import upiQrCode from "@/assets/upi-qr-code.jpeg";

const Payments = () => {
  const [copied, setCopied] = useState(false);
  const upiNumber = "7634927980";

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiNumber);
    setCopied(true);
    toast.success("UPI number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">
              Payment Options
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred payment method
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* UPI Payment Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>UPI Payment</CardTitle>
                <CardDescription>
                  Scan QR code or use UPI number for instant payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <img
                      src={upiQrCode}
                      alt="UPI QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>

                {/* UPI Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    UPI Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-secondary/50 rounded-md font-mono text-lg">
                      {upiNumber}
                    </div>
                    <Button
                      onClick={handleCopyUPI}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">How to pay:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
                    <li>Scan the QR code above or enter the UPI number</li>
                    <li>Enter the amount and complete the payment</li>
                    <li>Take a screenshot of payment confirmation</li>
                    <li>Share with us via WhatsApp or Contact form</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Shopify Checkout Card */}
            <Card>
              <CardHeader>
                <CardTitle>Online Checkout</CardTitle>
                <CardDescription>
                  Add items to cart and checkout securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can also shop normally by adding items to your cart and completing checkout through our secure payment gateway.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Accepted Payment Methods:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Credit/Debit Cards</li>
                    <li>Net Banking</li>
                    <li>UPI Apps</li>
                    <li>Wallets</li>
                  </ul>
                </div>

                <Button asChild className="w-full mt-4">
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Important Note */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After making a UPI payment, please contact us with your order details and payment confirmation. 
                We will process your order once we verify the payment. For instant checkout, please use our regular shopping cart.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Payments;
