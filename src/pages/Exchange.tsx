
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import ExchangeFilter from "@/components/ExchangeFilter";
import { filteredOffers } from "@/data/offers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Exchange = () => {
  const [activeFilters, setActiveFilters] = useState({
    paymentMethod: "",
    type: ""
  });

  const handleFilterChange = (filters: { paymentMethod: string; type: string }) => {
    setActiveFilters(filters);
  };

  const displayedOffers = filteredOffers(activeFilters.paymentMethod, activeFilters.type);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Exchange Marketplace</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse all available offers for crypto, PayPal, and Skrill exchanges
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="buy">Buy Crypto</TabsTrigger>
              <TabsTrigger value="sell">Sell Crypto</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <p className="text-center text-gray-600 mb-6">
                Showing all available exchange offers
              </p>
            </TabsContent>
            <TabsContent value="buy">
              <p className="text-center text-gray-600 mb-6">
                Exchange your PayPal or Skrill for cryptocurrency
              </p>
            </TabsContent>
            <TabsContent value="sell">
              <p className="text-center text-gray-600 mb-6">
                Sell your cryptocurrency for PayPal or Skrill
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ExchangeFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="lg:col-span-3">
              {displayedOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                  <p className="text-gray-600">
                    We couldn't find any offers matching your current filters. Try adjusting your filter criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Exchange;
