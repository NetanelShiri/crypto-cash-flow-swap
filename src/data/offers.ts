
import { OfferProps } from "@/components/OfferCard";

export const featuredOffers: OfferProps[] = [
  {
    id: "offer-1",
    type: "sell",
    from: {
      name: "BTC",
      amount: 0.0025,
      icon: "₿"
    },
    to: {
      name: "USD",
      amount: 100,
      icon: "$"
    },
    rate: 40000,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 50,
      max: 5000
    },
    paymentMethods: ["PayPal"]
  },
  {
    id: "offer-2",
    type: "sell",
    from: {
      name: "ETH",
      amount: 0.5,
      icon: "Ξ"
    },
    to: {
      name: "USD",
      amount: 950,
      icon: "$"
    },
    rate: 1900,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 100,
      max: 2000
    },
    paymentMethods: ["Skrill"]
  },
  {
    id: "offer-3",
    type: "sell",
    from: {
      name: "BTC",
      amount: 0.0025,
      icon: "₿"
    },
    to: {
      name: "EUR",
      amount: 90,
      icon: "€"
    },
    rate: 36000,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 50,
      max: 3000
    },
    paymentMethods: ["PayPal", "Skrill"]
  },
  {
    id: "offer-4",
    type: "sell",
    from: {
      name: "LTC",
      amount: 1,
      icon: "Ł"
    },
    to: {
      name: "USD",
      amount: 120,
      icon: "$"
    },
    rate: 120,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 25,
      max: 1000
    },
    paymentMethods: ["PayPal"]
  }
];

export const allOffers: OfferProps[] = [
  ...featuredOffers,
  {
    id: "offer-5",
    type: "sell",
    from: {
      name: "ETH",
      amount: 0.25,
      icon: "Ξ"
    },
    to: {
      name: "EUR",
      amount: 425,
      icon: "€"
    },
    rate: 1700,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 85,
      max: 1500
    },
    paymentMethods: ["Skrill"]
  },
  {
    id: "offer-6",
    type: "sell",
    from: {
      name: "LTC",
      amount: 2,
      icon: "Ł"
    },
    to: {
      name: "USD",
      amount: 240,
      icon: "$"
    },
    rate: 120,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 50,
      max: 2000
    },
    paymentMethods: ["PayPal"]
  },
  {
    id: "offer-7",
    type: "sell",
    from: {
      name: "BTC",
      amount: 0.001,
      icon: "₿"
    },
    to: {
      name: "GBP",
      amount: 32,
      icon: "£"
    },
    rate: 32000,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 32,
      max: 1600
    },
    paymentMethods: ["PayPal", "Skrill"]
  },
  {
    id: "offer-8",
    type: "sell",
    from: {
      name: "ETH",
      amount: 0.1,
      icon: "Ξ"
    },
    to: {
      name: "USD",
      amount: 190,
      icon: "$"
    },
    rate: 1900,
    seller: {
      name: "Admin",
      rating: 5.0,
      trades: 500
    },
    limits: {
      min: 95,
      max: 1900
    },
    paymentMethods: ["Skrill"]
  }
];

export const filteredOffers = (paymentMethod?: string, crypto?: string): OfferProps[] => {
  return allOffers.filter((offer) => {
    const matchesPaymentMethod = !paymentMethod || paymentMethod === "all" || offer.paymentMethods.includes(paymentMethod);
    const matchesCrypto = !crypto || crypto === "all" || offer.from.name === crypto;
    return matchesPaymentMethod && matchesCrypto;
  });
};

export const getOfferById = (id: string): OfferProps | undefined => {
  return allOffers.find(offer => offer.id === id);
};
