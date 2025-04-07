
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "LTC", label: "Litecoin (LTC)" },
  { value: "XRP", label: "Ripple (XRP)" }
];

const CreateOffer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [offerType, setOfferType] = useState<"buy" | "sell">("buy");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [rate, setRate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods(current => 
      current.includes(method)
        ? current.filter(m => m !== method)
        : [...current, method]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!cryptoCurrency) {
      toast({
        title: "Missing information",
        description: "Please select a cryptocurrency",
        variant: "destructive",
      });
      return;
    }
    
    if (!rate || isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
      toast({
        title: "Invalid rate",
        description: "Please enter a valid exchange rate",
        variant: "destructive",
      });
      return;
    }
    
    if (!minAmount || !maxAmount || 
        isNaN(parseFloat(minAmount)) || 
        isNaN(parseFloat(maxAmount)) || 
        parseFloat(minAmount) <= 0 ||
        parseFloat(maxAmount) <= 0 ||
        parseFloat(minAmount) >= parseFloat(maxAmount)) {
      toast({
        title: "Invalid limits",
        description: "Please enter valid minimum and maximum amount limits",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethods.length === 0) {
      toast({
        title: "Payment method required",
        description: "Please select at least one payment method",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form (in a real app, this would send data to the server)
    toast({
      title: "Offer created successfully",
      description: "Your exchange offer has been created and is now live.",
    });
    
    // Navigate back to exchange page
    setTimeout(() => {
      navigate("/exchange");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Create Exchange Offer</CardTitle>
              <CardDescription>
                Specify the details of your exchange offer for other users to see
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Offer Type</Label>
                  <RadioGroup 
                    value={offerType}
                    onValueChange={(value) => setOfferType(value as "buy" | "sell")}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="buy" />
                      <Label htmlFor="buy" className="font-normal cursor-pointer">
                        I want to buy crypto with PayPal/Skrill
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell" id="sell" />
                      <Label htmlFor="sell" className="font-normal cursor-pointer">
                        I want to sell crypto for PayPal/Skrill
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label htmlFor="crypto">Cryptocurrency</Label>
                  <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                    <SelectTrigger id="crypto">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="rate">Exchange Rate (USD per {cryptoCurrency || "crypto"})</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 40000 for BTC or 2000 for ETH"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="minAmount">Minimum Amount ($)</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 50"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="maxAmount">Maximum Amount ($)</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 1000"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Payment Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypal" 
                        checked={paymentMethods.includes("PayPal")}
                        onCheckedChange={() => handlePaymentMethodChange("PayPal")}
                      />
                      <Label htmlFor="paypal" className="font-normal cursor-pointer">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="skrill" 
                        checked={paymentMethods.includes("Skrill")}
                        onCheckedChange={() => handlePaymentMethodChange("Skrill")}
                      />
                      <Label htmlFor="skrill" className="font-normal cursor-pointer">Skrill</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 p-4 flex flex-col sm:flex-row justify-between gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate("/exchange")}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700"
                >
                  Create Offer
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateOffer;
