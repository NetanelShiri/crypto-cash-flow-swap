
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Clock, DollarSign, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: <Search className="h-12 w-12 text-brand-600" />,
    title: "1. Browse Exchange Offers",
    description: "Start by browsing available offers that match your needs. Filter by payment method, cryptocurrency, and offer type."
  },
  {
    icon: <DollarSign className="h-12 w-12 text-brand-600" />,
    title: "2. Choose and Initiate",
    description: "Select an offer with favorable rates and start the exchange process. Enter the amount you want to exchange."
  },
  {
    icon: <Clock className="h-12 w-12 text-brand-600" />,
    title: "3. Complete the Transaction",
    description: "Follow the payment instructions to send funds via PayPal or Skrill. Once confirmed, the cryptocurrency will be released."
  },
  {
    icon: <Shield className="h-12 w-12 text-brand-600" />,
    title: "4. Safe and Secure",
    description: "Our escrow system protects both parties throughout the transaction, ensuring safe and reliable exchanges."
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-brand-50 to-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How CryptoSwap Works</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes exchanging crypto for PayPal and Skrill simple, secure, and fast. 
              Here's how to get started.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="shadow-sm card-hover border border-gray-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Is CryptoSwap safe to use?</h3>
                  <p className="text-gray-600">
                    Yes, CryptoSwap uses an escrow system to protect both buyers and sellers during transactions. Funds are only released when both parties confirm the transaction is complete.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">What cryptocurrencies can I exchange?</h3>
                  <p className="text-gray-600">
                    Currently, we support Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and Ripple (XRP). We're constantly working to add more options.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">How long do exchanges take?</h3>
                  <p className="text-gray-600">
                    Most exchanges are completed within 10-30 minutes. The exact time depends on the payment method and the seller's response time.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">What are the fees for using CryptoSwap?</h3>
                  <p className="text-gray-600">
                    CryptoSwap charges a small fee of 1% per transaction. This fee is automatically calculated and displayed before you confirm your exchange.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Can I create my own exchange offers?</h3>
                  <p className="text-gray-600">
                    Yes! Any registered user can create their own buy or sell offers. You can set your own exchange rate and payment methods.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">What if I have a problem with my exchange?</h3>
                  <p className="text-gray-600">
                    If you encounter any issues, our support team is available to help. You can open a dispute for any transaction, and we'll mediate to find a resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Exchanging?</h2>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
              Join thousands of users who are already exchanging crypto for PayPal and Skrill on our platform.
            </p>
            <Link to="/exchange">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50">
                Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
