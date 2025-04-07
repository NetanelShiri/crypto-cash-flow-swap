
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, ArrowRightIcon, Shield, Star, AlertCircle, Check } from "lucide-react";
import { getOfferById } from "@/data/offers";
import { useToast } from "@/components/ui/use-toast";

const OfferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  
  const offer = getOfferById(id || "");
  
  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Offer Not Found</h1>
            <p className="text-gray-600 mb-6">The exchange offer you're looking for does not exist.</p>
            <Button onClick={() => navigate("/exchange")}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Exchange
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isBuy = offer.type === "buy";
  const maxAmount = Math.min(offer.limits.max, isBuy ? 5000 : 0.5);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const calculateReceiveAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";
    
    if (isBuy) {
      // Buying crypto: USD to BTC
      return (numAmount / offer.rate).toFixed(6);
    } else {
      // Selling crypto: BTC to USD
      return (numAmount * offer.rate).toFixed(2);
    }
  };
  
  const handleNextStep = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (numAmount < offer.limits.min || numAmount > offer.limits.max) {
      toast({
        title: "Amount out of range",
        description: `Amount must be between $${offer.limits.min} and $${offer.limits.max}`,
        variant: "destructive",
      });
      return;
    }
    
    setStep(2);
  };
  
  const handleCompleteTransaction = () => {
    toast({
      title: "Transaction started",
      description: "You'll be redirected to complete your payment shortly.",
    });
    
    // Simulate redirect after payment
    setTimeout(() => {
      navigate("/exchange");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Card className="shadow-md border-0">
            <CardHeader className={`pb-2 ${isBuy ? "bg-success-50" : "bg-brand-50"}`}>
              <div className="flex justify-between items-center">
                <Badge variant={isBuy ? "outline" : "default"} className={isBuy ? "border-success-500 text-success-600" : "bg-brand-500"}>
                  {isBuy ? "Buy Crypto" : "Sell Crypto"}
                </Badge>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{offer.seller.trades}+ trades</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm">{offer.seller.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">
                {isBuy 
                  ? `Buy ${offer.to.name} with ${offer.from.name}` 
                  : `Sell ${offer.from.name} for ${offer.to.name}`}
              </CardTitle>
              <CardDescription className="text-base">
                Rate: <span className="font-semibold text-gray-900">
                  {offer.rate.toFixed(2)} {offer.to.name}/{offer.from.name}
                </span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Seller Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Seller</span>
                          <span className="font-medium">{offer.seller.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rating</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{offer.seller.rating.toFixed(1)}/5.0</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Trades</span>
                          <span className="font-medium">{offer.seller.trades}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Exchange Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method</span>
                          <div className="flex flex-wrap justify-end gap-1">
                            {offer.paymentMethods.map((method, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Limits</span>
                          <span className="font-medium">${offer.limits.min} - ${offer.limits.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Enter Exchange Amount</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                          {isBuy ? `${offer.from.name} Amount` : `${offer.from.name} Amount`}
                        </label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            placeholder={`Enter amount (min: ${offer.limits.min}, max: ${maxAmount})`}
                            value={amount}
                            onChange={handleAmountChange}
                            className="pr-12"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                            {isBuy ? offer.from.icon : offer.from.icon}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {isBuy ? `${offer.to.name} Amount` : `${offer.to.name} Amount`}
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={calculateReceiveAmount()}
                            readOnly
                            className="bg-gray-50 pr-12"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                            {isBuy ? offer.to.icon : offer.to.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Payment Instructions</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        This is a simulated exchange. In a real application, you would now need to follow the seller's instructions for making payment via {offer.paymentMethods.join(" or ")}.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-lg font-medium mb-4">Exchange Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction Type</span>
                        <span className="font-medium">{isBuy ? "Buy Crypto" : "Sell Crypto"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Exchange Rate</span>
                        <span className="font-medium">{offer.rate.toFixed(2)} {offer.to.name}/{offer.from.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isBuy ? "You Pay" : "You Send"}</span>
                        <span className="font-medium">{amount} {isBuy ? offer.from.name : offer.from.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isBuy ? "You Receive" : "You Receive"}</span>
                        <span className="font-medium">{calculateReceiveAmount()} {isBuy ? offer.to.name : offer.to.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium">{offer.paymentMethods.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-success-500 mr-2" />
                      <span className="text-gray-700">Make payment using the provided instructions</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-success-500 mr-2" />
                      <span className="text-gray-700">Confirm payment was sent</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-success-500 mr-2" />
                      <span className="text-gray-700">Wait for seller to release {isBuy ? "crypto" : "funds"}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t bg-gray-50 p-4 flex flex-col sm:flex-row justify-between gap-3">
              {step === 1 ? (
                <>
                  <Button variant="outline" onClick={() => navigate("/exchange")} className="flex-1 sm:flex-none">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    className={`flex-1 sm:flex-none ${isBuy ? "bg-success-600 hover:bg-success-700" : "bg-brand-600 hover:bg-brand-700"}`}
                  >
                    Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 sm:flex-none">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={handleCompleteTransaction} 
                    className={`flex-1 sm:flex-none ${isBuy ? "bg-success-600 hover:bg-success-700" : "bg-brand-600 hover:bg-brand-700"}`}
                  >
                    {isBuy ? "Confirm Purchase" : "Confirm Sale"}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OfferDetails;
