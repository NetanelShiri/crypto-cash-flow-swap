
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="text-xl font-bold gradient-text">CryptoSwap</Link>
            <p className="text-gray-600 text-sm">
              The easiest way to exchange cryptocurrency for PayPal and Skrill, and vice versa.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Exchange</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/exchange" className="text-gray-600 hover:text-gray-900">
                  Browse Offers
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-600 hover:text-gray-900">
                  Create Offer
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 hover:text-gray-900">
                  Trade History
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-600 hover:text-gray-900">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} CryptoSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
