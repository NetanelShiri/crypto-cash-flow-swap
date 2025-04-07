
import { OfferProps } from "@/components/OfferCard";

export const featuredOffers: OfferProps[] = [
  {
    id: "offer-1",
    type: "buy",
    from: {
      name: "USD",
      amount: 100,
      icon: "$"
    },
    to: {
      name: "BTC",
      amount: 0.0025,
      icon: "₿"
    },
    rate: 40000,
    seller: {
      name: "CryptoKing",
      rating: 4.9,
      trades: 356
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
      name: "EtherQueen",
      rating: 4.8,
      trades: 215
    },
    limits: {
      min: 100,
      max: 2000
    },
    paymentMethods: ["Skrill"]
  },
  {
    id: "offer-3",
    type: "buy",
    from: {
      name: "EUR",
      amount: 500,
      icon: "€"
    },
    to: {
      name: "ETH",
      amount: 0.25,
      icon: "Ξ"
    },
    rate: 2000,
    seller: {
      name: "CryptoTrade",
      rating: 4.7,
      trades: 189
    },
    limits: {
      min: 100,
      max: 3000
    },
    paymentMethods: ["PayPal", "Skrill"]
  },
  {
    id: "offer-4",
    type: "sell",
    from: {
      name: "BTC",
      amount: 0.01,
      icon: "₿"
    },
    to: {
      name: "USD",
      amount: 400,
      icon: "$"
    },
    rate: 40000,
    seller: {
      name: "BitcoinPro",
      rating: 5.0,
      trades: 423
    },
    limits: {
      min: 200,
      max: 4000
    },
    paymentMethods: ["PayPal"]
  }
];

export const allOffers: OfferProps[] = [
  ...featuredOffers,
  {
    id: "offer-5",
    type: "buy",
    from: {
      name: "USD",
      amount: 300,
      icon: "$"
    },
    to: {
      name: "LTC",
      amount: 2.5,
      icon: "Ł"
    },
    rate: 120,
    seller: {
      name: "LiteLover",
      rating: 4.5,
      trades: 83
    },
    limits: {
      min: 100,
      max: 1500
    },
    paymentMethods: ["Skrill"]
  },
  {
    id: "offer-6",
    type: "sell",
    from: {
      name: "XRP",
      amount: 1000,
      icon: "✕"
    },
    to: {
      name: "EUR",
      amount: 450,
      icon: "€"
    },
    rate: 0.45,
    seller: {
      name: "RippleTrader",
      rating: 4.6,
      trades: 175
    },
    limits: {
      min: 50,
      max: 2500
    },
    paymentMethods: ["PayPal"]
  },
  {
    id: "offer-7",
    type: "buy",
    from: {
      name: "GBP",
      amount: 200,
      icon: "£"
    },
    to: {
      name: "BTC",
      amount: 0.005,
      icon: "₿"
    },
    rate: 40000,
    seller: {
      name: "UKCrypto",
      rating: 4.7,
      trades: 124
    },
    limits: {
      min: 100,
      max: 3000
    },
    paymentMethods: ["PayPal", "Skrill"]
  },
  {
    id: "offer-8",
    type: "sell",
    from: {
      name: "ETH",
      amount: 0.75,
      icon: "Ξ"
    },
    to: {
      name: "USD",
      amount: 1425,
      icon: "$"
    },
    rate: 1900,
    seller: {
      name: "EtherGenius",
      rating: 4.9,
      trades: 256
    },
    limits: {
      min: 200,
      max: 5000
    },
    paymentMethods: ["Skrill"]
  }
];

export const filteredOffers = (paymentMethod?: string, type?: string): OfferProps[] => {
  return allOffers.filter((offer) => {
    const matchesPaymentMethod = !paymentMethod || offer.paymentMethods.includes(paymentMethod);
    const matchesType = !type || offer.type === type;
    return matchesPaymentMethod && matchesType;
  });
};

export const getOfferById = (id: string): OfferProps | undefined => {
  return allOffers.find(offer => offer.id === id);
};
