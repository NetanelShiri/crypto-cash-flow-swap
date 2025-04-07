
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-gray-50">
      <div className="absolute inset-y-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMTgwZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptLTYtNmg0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bS02LTZoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0tNi02aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMzAtMTJWNGgtMXYxM2gxem0tMyAwVjRoLTF2MTNoMXptLTMgMFY0aC0xdjEzaDF6bS0zIDBWNGgtMXYxM2gxem0tMyAwVjRoLTF2MTNoMXptLTMgMFY0aC0xdjEzaDF6bS0zIDBWNGgtMXYxM2gxem0tMyAwVjRoLTF2MTNoMXptLTMgMFY0aC0xdjEzaDF6bS0zIDBWNGgtMXYxM2gxem0tMyAwVjRoLTF2MTNoMXptLTMgMFY0aC0xdjEzaDF6bTE1LTZoLTd2LTFoN3YxeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            <span className="block">Exchange Crypto for</span>
            <span className="block gradient-text">PayPal & Skrill</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-lg sm:text-xl text-gray-500">
            The easiest and safest way to exchange your crypto for PayPal, Skrill, or vice versa. Fast, secure, and user-friendly.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/exchange">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white">
                Start Exchange <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
