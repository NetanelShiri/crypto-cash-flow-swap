
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface OfferProps {
  id: string;
  type: "buy" | "sell";
  from: {
    name: string;
    amount: number;
    icon: string;
  };
  to: {
    name: string;
    amount: number;
    icon: string;
  };
  rate: number;
  seller: {
    name: string;
    rating: number;
    trades: number;
  };
  limits: {
    min: number;
    max: number;
  };
  paymentMethods: string[];
}

const OfferCard = ({ offer }: { offer: OfferProps }) => {
  return (
    <Card className="card-hover overflow-hidden border border-gray-200">
      <CardHeader className="pb-2 bg-brand-50">
        <div className="flex justify-between items-center">
          <Badge className="bg-brand-500">Sell {offer.from.name}</Badge>
          <div className="flex items-center space-x-1 text-gray-500">
            <Shield className="w-4 h-4" />
            <span className="text-sm text-gray-500">{offer.seller.trades}+ trades</span>
          </div>
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="font-medium">{offer.from.name}</span>
          <ArrowRightLeft className="w-4 h-4" />
          <span className="font-medium">{offer.to.name}</span>
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-900">{offer.rate.toFixed(2)} {offer.to.name}/{offer.from.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{offer.seller.rating.toFixed(1)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Methods</span>
            <div className="flex flex-wrap justify-end gap-1">
              {offer.paymentMethods.map((method, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Exchange Limits</span>
            <span className="font-medium">${offer.limits.min} - ${offer.limits.max}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4">
        <Link to={`/offer/${offer.id}`} className="w-full">
          <Button className="w-full bg-brand-600 hover:bg-brand-700">
            Sell {offer.from.name}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
