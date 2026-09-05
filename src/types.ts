export type ProductTag = "featured" | "new" | "best";

export type ProductColor = {
  name: string;
  value: string;
};

export type Category = {
  name: string;
  slug: string;
  image: string;
  summary: string;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  tags: ProductTag[];
  material: string;
  care: string;
};

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type CartLine = CartItem & {
  product: Product;
  lineTotal: number;
};

export type PaymentMethod = "COD" | "bKash";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type TelegramStatus = "sent" | "pending" | "failed";

export type CustomerInfo = {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
};

export type PaymentInfo = {
  method: PaymentMethod;
  senderNumber?: string;
  transactionId?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export type DeliveryZone = "inside" | "outside";

export type Order = {
  id: string;
  customer: CustomerInfo;
  payment: PaymentInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryZone?: DeliveryZone;
  deliveryCharge: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  telegramStatus: TelegramStatus;
  orderTime: string;
  archived?: boolean;
};

export type ProductDraft = Omit<Product, "id" | "slug"> & {
  id?: string;
  slug?: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
};

export type CampaignContent = {
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
};

export type StoreInfoContent = {
  merchantBkashNumber: string;
  whatsappNumber: string;
  email: string;
  instagramUrl: string;
  location: string;
  footerAbout: string;
};

export type DeliverySettings = {
  insideDhakaRate: number;
  outsideDhakaRate: number;
  freeDeliveryMinAmount: number;
};

export type BulkDiscountSettings = {
  enabled: boolean;
  minSpend: number;
  discountPercentage: number;
};

export type SiteContent = {
  hero: HeroContent;
  campaign: CampaignContent;
  storeInfo: StoreInfoContent;
  delivery: DeliverySettings;
  bulkDiscount: BulkDiscountSettings;
};
