
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FilterIcon } from "lucide-react";

interface ExchangeFilterProps {
  onFilterChange: (filters: {
    paymentMethod: string;
    crypto: string;
  }) => void;
}

const ExchangeFilter = ({ onFilterChange }: ExchangeFilterProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [crypto, setCrypto] = useState<string>("all");

  const handleFilterApply = () => {
    onFilterChange({
      paymentMethod,
      crypto
    });
  };

  const handleReset = () => {
    setPaymentMethod("all");
    setCrypto("all");
    onFilterChange({
      paymentMethod: "all",
      crypto: "all"
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FilterIcon className="w-5 h-5 mr-2" /> Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="All payment methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment methods</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Skrill">Skrill</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cryptocurrency</Label>
          <RadioGroup value={crypto} onValueChange={setCrypto} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-crypto" />
              <Label htmlFor="all-crypto" className="font-normal cursor-pointer">All cryptocurrencies</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BTC" id="btc" />
              <Label htmlFor="btc" className="font-normal cursor-pointer">Bitcoin (BTC)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ETH" id="eth" />
              <Label htmlFor="eth" className="font-normal cursor-pointer">Ethereum (ETH)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LTC" id="ltc" />
              <Label htmlFor="ltc" className="font-normal cursor-pointer">Litecoin (LTC)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={handleFilterApply} className="bg-brand-600 hover:bg-brand-700">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset} className="border-brand-200 text-brand-700 hover:bg-brand-50">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeFilter;
