import type { SiteContent } from "../types";

export const defaultSiteContent: SiteContent = {
  hero: {
    badge: "Autumn Edit 2026",
    title: "PoshakHeaven",
    subtitle:
      "Premium wardrobe essentials for Bangladesh, shaped by refined fabric, modern proportion, and quiet luxury details.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85",
    primaryButtonText: "Shop Now",
    primaryButtonLink: "/shop",
    secondaryButtonText: "New Arrivals",
    secondaryButtonLink: "/shop?tag=new"
  },
  campaign: {
    eyebrow: "Limited Campaign",
    title: "Mid-season pieces, softer pricing.",
    description:
      "Save on selected t-shirts, hoodies, shirts, and accessories while stock lasts. Cash On Delivery and bKash Payment are available at checkout.",
    buttonText: "Explore Edit",
    buttonLink: "/shop",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=82"
    ]
  },
  storeInfo: {
    merchantBkashNumber: "01970430152",
    whatsappNumber: "01970430152",
    email: "poshakheaven.info@gmail.com",
    instagramUrl: "https://www.instagram.com/poshakheaven",
    location: "Dhaka, Bangladesh",
    footerAbout:
      "Premium fashion essentials for Bangladesh, designed around refined fabric, quiet detailing, and effortless everyday wear."
  },
  delivery: {
    insideDhakaRate: 80,
    outsideDhakaRate: 150,
    freeDeliveryMinAmount: 5000
  },
  bulkDiscount: {
    enabled: true,
    minSpend: 5000,
    discountPercentage: 10
  }
};
