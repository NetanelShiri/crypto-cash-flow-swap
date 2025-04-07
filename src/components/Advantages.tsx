
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  Globe 
} from "lucide-react";

const advantages = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-brand-600" />,
    title: "Secure Transactions",
    description: "All trades are protected by our escrow service ensuring your funds remain safe throughout the exchange process."
  },
  {
    icon: <Clock className="h-8 w-8 text-brand-600" />,
    title: "Fast Exchanges",
    description: "Complete your transactions quickly with our streamlined process designed for efficiency."
  },
  {
    icon: <Users className="h-8 w-8 text-brand-600" />,
    title: "Verified Users",
    description: "Trade with confidence knowing all users on our platform are verified and rated by the community."
  },
  {
    icon: <Globe className="h-8 w-8 text-brand-600" />,
    title: "Global Community",
    description: "Connect with traders from around the world and access a wide range of exchange options."
  }
];

const Advantages = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose CryptoSwap</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We make exchanging cryptocurrencies for PayPal and Skrill simple, secure, and hassle-free.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center card-hover">
              <div className="inline-flex items-center justify-center p-2 bg-brand-100 rounded-lg mb-4">
                {advantage.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{advantage.title}</h3>
              <p className="mt-2 text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advantages;
