
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import ExchangeFilter from "@/components/ExchangeFilter";
import { filteredOffers } from "@/data/offers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Exchange = () => {
  const [activeFilters, setActiveFilters] = useState({
    paymentMethod: "all",
    crypto: "all"
  });

  const handleFilterChange = (filters: { paymentMethod: string; crypto: string }) => {
    setActiveFilters(filters);
  };

  // Filter offers based on payment method and crypto
  const displayedOffers = filteredOffers(activeFilters.paymentMethod, activeFilters.crypto);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sell Your Crypto</h1>
            <p className="mt-2 text-lg text-gray-600">
              Quick and secure way to exchange your cryptocurrency for PayPal or Skrill
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
              <TabsTrigger value="all">All Cryptos</TabsTrigger>
              <TabsTrigger value="BTC">Bitcoin</TabsTrigger>
              <TabsTrigger value="ETH">Ethereum</TabsTrigger>
              <TabsTrigger value="LTC">Litecoin</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <p className="text-center text-gray-600 mb-6">
                View all available cryptocurrencies we accept
              </p>
            </TabsContent>
            <TabsContent value="BTC">
              <p className="text-center text-gray-600 mb-6">
                Exchange your Bitcoin (BTC) for PayPal or Skrill
              </p>
            </TabsContent>
            <TabsContent value="ETH">
              <p className="text-center text-gray-600 mb-6">
                Exchange your Ethereum (ETH) for PayPal or Skrill
              </p>
            </TabsContent>
            <TabsContent value="LTC">
              <p className="text-center text-gray-600 mb-6">
                Exchange your Litecoin (LTC) for PayPal or Skrill
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ExchangeFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">How It Works</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Select the cryptocurrency you want to sell</li>
                  <li>Choose your preferred payment method (PayPal or Skrill)</li>
                  <li>Follow the instructions to securely transfer your crypto</li>
                  <li>Receive payment to your PayPal or Skrill account</li>
                </ol>
              </div>
              
              {displayedOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No options available</h3>
                  <p className="text-gray-600">
                    We couldn't find any exchange options matching your current filters. Try adjusting your filter criteria.
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
