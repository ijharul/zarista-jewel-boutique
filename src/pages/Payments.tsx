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

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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

            {/* COD Payment Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Cash on Delivery (COD)</CardTitle>
                <CardDescription>
                  Pay in cash when your order is delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* COD Icon/Illustration */}
                <div className="flex justify-center py-8">
                  <div className="bg-primary/10 rounded-full p-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Available for all locations</p>
                    <p className="text-xs text-muted-foreground">
                      Pay with cash at the time of delivery. No advance payment required.
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">How COD works:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Browse and select your favorite jewelry</li>
                      <li>Contact us with your order details</li>
                      <li>We'll confirm your order and delivery date</li>
                      <li>Pay in cash when the product is delivered</li>
                      <li>Inspect the product before payment</li>
                    </ol>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link to="/contact">
                      Place COD Order
                    </Link>
                  </Button>
                </div>
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
                After making a UPI payment or placing a COD order, please contact us with your order details. 
                We will process your order and confirm the delivery date. For any queries, feel free to reach out via WhatsApp or our contact form.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Payments;
