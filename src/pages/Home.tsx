
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import { featuredOffers } from "@/data/offers";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Featured Exchange Offers</h2>
              <p className="mt-4 text-lg text-gray-600">
                Browse our most popular crypto exchange offers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/exchange">
                <Button variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50">
                  View All Offers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <Advantages />
        
        <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">Ready to Start Exchanging?</h2>
            <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
              Join thousands of users exchanging cryptocurrencies for PayPal and Skrill every day.
            </p>
            <div className="mt-8">
              <Link to="/exchange">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50">
                  Start Trading Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
