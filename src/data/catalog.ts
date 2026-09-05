import type { Category, Product } from "../types";

const img = (id: string, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

export const categories: Category[] = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    image: img("photo-1521572163474-6864f9cf17ab"),
    summary: "Refined cotton staples for clean daily rotation."
  },
  {
    name: "Oversized T-Shirts",
    slug: "oversized-t-shirts",
    image: img("photo-1622445275463-afa2ab738c34"),
    summary: "Relaxed silhouettes with premium heavyweight hand feel."
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: img("photo-1598033129183-c4f50c736f10"),
    summary: "Crisp button-downs for dressed casual edits."
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    image: img("photo-1620799140408-edc6dcb6d633"),
    summary: "Warm brushed layers with a quiet luxury finish."
  },
  {
    name: "Pants",
    slug: "pants",
    image: img("photo-1594633312681-425c7b97ccd1"),
    summary: "Tailored trousers and weekend-ready relaxed fits."
  },
  {
    name: "Joggers",
    slug: "joggers",
    image: img("photo-1552374196-1ab2a1c593e8"),
    summary: "Soft movement pieces built for travel and downtime."
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: img("photo-1523170335258-f5ed11844a49"),
    summary: "Minimal finishing pieces for considered wardrobes."
  }
];

export const seedProducts: Product[] = [
  {
    id: "ph-tee-001",
    slug: "signature-interlock-tee",
    sku: "PH-TEE-001",
    name: "Signature Interlock Tee",
    category: "T-Shirts",
    description:
      "A structured cotton interlock tee with a polished neckline, refined drape, and breathable all-day comfort.",
    price: 1450,
    discountPrice: 1190,
    stock: 42,
    images: [
      img("photo-1521572163474-6864f9cf17ab", 1200),
      img("photo-1618354691373-d851c5c3a990", 1200),
      img("photo-1581655353564-df123a1eb820", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ivory", value: "#F3E7DA" },
      { name: "Espresso", value: "#2B1B17" },
      { name: "Sage", value: "#8D9B6A" }
    ],
    tags: ["featured", "best"],
    material: "240 GSM cotton interlock",
    care: "Machine wash cold, dry flat, warm iron inside out."
  },
  {
    id: "ph-tee-002",
    slug: "heavyweight-oversized-tee",
    sku: "PH-TEE-002",
    name: "Heavyweight Oversized Tee",
    category: "Oversized T-Shirts",
    description:
      "A boxy premium tee cut from dense cotton jersey with dropped shoulders and a soft garment wash.",
    price: 1650,
    discountPrice: 1390,
    stock: 28,
    images: [
      img("photo-1622445275463-afa2ab738c34", 1200),
      img("photo-1618354691438-25bc04584c23", 1200),
      img("photo-1578932750355-5eb30ece487a", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#101010" },
      { name: "Cream", value: "#EFE6DA" },
      { name: "Stone", value: "#B9AEA4" }
    ],
    tags: ["new", "featured"],
    material: "300 GSM compact cotton jersey",
    care: "Wash with similar colors and avoid bleach."
  },
  {
    id: "ph-shirt-001",
    slug: "atelier-oxford-shirt",
    sku: "PH-SHT-001",
    name: "Atelier Oxford Shirt",
    category: "Shirts",
    description:
      "A modern oxford shirt with a clean placket, relaxed cuffs, and a versatile smart-casual profile.",
    price: 2250,
    discountPrice: 1890,
    stock: 33,
    images: [
      img("photo-1598033129183-c4f50c736f10", 1200),
      img("photo-1602810318383-e386cc2a3ccf", 1200),
      img("photo-1607345366928-199ea26cfe3e", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Sky", value: "#B9D2E8" },
      { name: "Graphite", value: "#3E3F42" }
    ],
    tags: ["featured", "best"],
    material: "Cotton oxford weave",
    care: "Machine wash gentle, hang dry, iron medium."
  },
  {
    id: "ph-hood-001",
    slug: "dusk-fleece-hoodie",
    sku: "PH-HOD-001",
    name: "Dusk Fleece Hoodie",
    category: "Hoodies",
    description:
      "A brushed fleece hoodie with a substantial feel, tonal drawcords, and a clean kangaroo pocket.",
    price: 2950,
    discountPrice: 2490,
    stock: 19,
    images: [
      img("photo-1620799140408-edc6dcb6d633", 1200),
      img("photo-1556821840-3a63f95609a7", 1200),
      img("photo-1611312449408-fcece27cdbb7", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Mocha", value: "#6E5549" },
      { name: "Forest", value: "#31443A" },
      { name: "Black", value: "#101010" }
    ],
    tags: ["new", "best"],
    material: "Cotton-rich brushed fleece",
    care: "Cold wash inside out, tumble dry low."
  },
  {
    id: "ph-pant-001",
    slug: "tailored-twill-pants",
    sku: "PH-PNT-001",
    name: "Tailored Twill Pants",
    category: "Pants",
    description:
      "Tapered twill pants with a clean waistband, subtle stretch, and a smooth line from hip to hem.",
    price: 3150,
    discountPrice: 2690,
    stock: 24,
    images: [
      img("photo-1594633312681-425c7b97ccd1", 1200),
      img("photo-1506629905607-d9c297d23d30", 1200),
      img("photo-1542272604-787c3835535d", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Taupe", value: "#9A8372" },
      { name: "Navy", value: "#1F2A44" },
      { name: "Charcoal", value: "#2F2F31" }
    ],
    tags: ["featured"],
    material: "Stretch cotton twill",
    care: "Wash cold, reshape while damp."
  },
  {
    id: "ph-jog-001",
    slug: "modal-travel-joggers",
    sku: "PH-JOG-001",
    name: "Modal Travel Joggers",
    category: "Joggers",
    description:
      "Soft modal-blend joggers with a tapered cuff, matte hardware, and enough structure for city wear.",
    price: 2550,
    discountPrice: 2190,
    stock: 17,
    images: [
      img("photo-1552374196-1ab2a1c593e8", 1200),
      img("photo-1611312449408-fcece27cdbb7", 1200),
      img("photo-1523398002811-999ca8dec234", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Oat", value: "#CDBFAF" },
      { name: "Ink", value: "#15181C" },
      { name: "Olive", value: "#5C6449" }
    ],
    tags: ["new"],
    material: "Modal, cotton, and elastane blend",
    care: "Gentle wash, line dry in shade."
  },
  {
    id: "ph-acc-001",
    slug: "grain-leather-card-holder",
    sku: "PH-ACC-001",
    name: "Grain Leather Card Holder",
    category: "Accessories",
    description:
      "A slim card holder in grained leather with three slots, a central pocket, and debossed branding.",
    price: 1850,
    stock: 31,
    images: [
      img("photo-1523170335258-f5ed11844a49", 1200),
      img("photo-1627123424574-724758594e93", 1200),
      img("photo-1511499767150-a48a237f0083", 1200)
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Espresso", value: "#2B1B17" },
      { name: "Black", value: "#101010" }
    ],
    tags: ["best"],
    material: "Full-grain leather",
    care: "Wipe with dry cloth and avoid moisture."
  },
  {
    id: "ph-shirt-002",
    slug: "linen-resort-shirt",
    sku: "PH-SHT-002",
    name: "Linen Resort Shirt",
    category: "Shirts",
    description:
      "A breathable linen-blend shirt with an open collar, relaxed sleeve, and an easy holiday silhouette.",
    price: 2450,
    discountPrice: 2090,
    stock: 22,
    images: [
      img("photo-1529139574466-a303027c1d8b", 1200),
      img("photo-1496747611176-843222e1e57c", 1200),
      img("photo-1525507119028-ed4c629a60a3", 1200)
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ecru", value: "#E7D8C8" },
      { name: "Clay", value: "#B2745F" },
      { name: "Sea", value: "#7E9B9C" }
    ],
    tags: ["new", "featured"],
    material: "Linen and cotton blend",
    care: "Cold hand wash recommended."
  }
];

export const sizeOptions = ["S", "M", "L", "XL", "XXL", "One Size"];

export const statusOptions = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
] as const;
