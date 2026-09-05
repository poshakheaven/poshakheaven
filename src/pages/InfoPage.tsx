import {
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";

type InfoType =
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "shipping"
  | "returns";

type InfoPageProps = {
  type: InfoType;
};

const content: Record<
  InfoType,
  {
    title: string;
    eyebrow: string;
    description: string;
    sections: { title: string; body: string }[];
  }
> = {
  about: {
    title: "The Brand Philosophy",
    eyebrow: "Our Heritage",
    description:
      "PoshakHeaven was founded on a simple conviction: luxury wardrobe essentials in Bangladesh should be defined by fabric weight, refined tailoring, and understated elegance.",
    sections: [
      {
        title: "Heavyweight Natural Fabrics",
        body: "We select premium 240+ GSM combed and interlock cotton for structured drape, softness against the skin, and remarkable resilience after continuous laundering."
      },
      {
        title: "Modern Architectural Silhouettes",
        body: "Every pattern is proportioned with intention: relaxed shoulders, shape-retaining collars, and balanced lengths crafted for both tropical climates and layered dressing."
      },
      {
        title: "Devotion to Craftsmanship",
        body: "From twin-needle hems to reinforced collars and subtle tonal details, each garment honors deliberate craftsmanship over seasonal trends."
      }
    ]
  },
  contact: {
    title: "Client Concierge",
    eyebrow: "Get In Touch",
    description:
      "For sizing advice, order assistance, or wholesale inquiries, our dedicated concierge team is available 7 days a week.",
    sections: []
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Data Protection",
    description:
      "We respect your privacy and process customer data strictly to fulfill your orders and enhance your shopping experience.",
    sections: [
      {
        title: "Information Collected",
        body: "We collect only essential details including customer name, phone number, and delivery address to facilitate nationwide courier shipping."
      },
      {
        title: "Payment Security",
        body: "We do not store financial credit card credentials. Manual bKash transactions and Cash On Delivery are verified securely for each specific order."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Agreement",
    description:
      "By placing an order on PoshakHeaven, you agree to our standard store terms and fulfillment conditions.",
    sections: [
      {
        title: "Order Placement & Confirmation",
        body: "Orders are verified by our team before dispatch. We reserve the right to cancel orders with incorrect or unverifiable contact information."
      },
      {
        title: "Pricing & Currency",
        body: "All prices are listed in Bangladeshi Taka (৳). Delivery charges are computed transparently based on your selected delivery destination."
      }
    ]
  },
  shipping: {
    title: "Shipping & Delivery",
    eyebrow: "Logistics",
    description:
      "Doorstep delivery across all 64 districts in Bangladesh with real-time tracking.",
    sections: [
      {
        title: "Delivery Rates & Timeframes",
        body: "Inside Dhaka: ৳80 (24–48 hours). Outside Dhaka: ৳150 (3–4 business days). Complimentary free delivery applies automatically on orders exceeding ৳5,000."
      },
      {
        title: "Courier Inspection on Delivery",
        body: "You may inspect your parcel in the presence of the delivery courier before settling Cash On Delivery payment."
      }
    ]
  },
  returns: {
    title: "Exchange & Returns",
    eyebrow: "Customer Assurance",
    description:
      "We want every silhouette to fit impeccably. Our exchange process is quick and hassle-free.",
    sections: [
      {
        title: "7-Day Exchange Window",
        body: "If your chosen size is not ideal, you may request an exchange within 7 days of receiving the parcel, provided the item is unwashed and tags remain attached."
      },
      {
        title: "How to Initiate an Exchange",
        body: "Simply contact our WhatsApp concierge with your Order Reference ID and preferred replacement size. Our team will arrange the courier exchange."
      }
    ]
  }
};

export function InfoPage({ type }: InfoPageProps) {
  const { siteContent } = useStore();
  const { storeInfo } = siteContent;
  const page = content[type];

  const whatsappHref = storeInfo?.whatsappNumber
    ? `https://wa.me/88${storeInfo.whatsappNumber.replace(/\D/g, "")}`
    : "https://wa.me/8801970430152";

  return (
    <>
      <Meta title={page.title} description={page.description} />

      {/* Header Banner */}
      <section className="border-b border-white/10 bg-[#170E0B] py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-accent" />
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
              {page.eyebrow}
            </p>
            <span className="h-px w-6 bg-accent" />
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-muted">
            {page.description}
          </p>
        </div>
      </section>

      {/* Content Body */}
      <section className="bg-[#120B09] py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {type === "contact" ? (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* WhatsApp */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#1A110E] p-5 transition hover:border-accent hover:shadow-soft"
                >
                  <div>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/20 text-[#25D366] mb-4">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-ink">
                      WhatsApp
                    </h3>
                    <p className="mt-1 text-xs text-muted">Instant Concierge Chat</p>
                  </div>
                  <p className="mt-4 text-xs font-mono font-bold text-accent">
                    {storeInfo?.whatsappNumber || "01970430152"}
                  </p>
                </a>

                {/* Email */}
                {storeInfo?.email && (
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#1A110E] p-5 transition hover:border-accent hover:shadow-soft"
                  >
                    <div>
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent mb-4">
                        <Mail className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-ink">
                        Email
                      </h3>
                      <p className="mt-1 text-xs text-muted">Official Inquiries</p>
                    </div>
                    <p className="mt-4 text-xs font-mono font-bold text-accent truncate">
                      {storeInfo.email}
                    </p>
                  </a>
                )}

                {/* Instagram */}
                {storeInfo?.instagramUrl && (
                  <a
                    href={storeInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#1A110E] p-5 transition hover:border-accent hover:shadow-soft"
                  >
                    <div>
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-pink-500/20 text-pink-400 mb-4">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-ink">
                        Instagram
                      </h3>
                      <p className="mt-1 text-xs text-muted">Lookbooks & Stories</p>
                    </div>
                    <p className="mt-4 text-xs font-mono font-bold text-accent">
                      @poshakheaven
                    </p>
                  </a>
                )}

                {/* Location */}
                <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#1A110E] p-5">
                  <div>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent mb-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-ink">
                      Location
                    </h3>
                    <p className="mt-1 text-xs text-muted">Boutique Headquarters</p>
                  </div>
                  <p className="mt-4 text-xs font-bold text-ink">
                    {storeInfo?.location || "Dhaka, Bangladesh"}
                  </p>
                </div>
              </div>

              {/* Concierge Assurance Box */}
              <div className="rounded-lg border border-accent/25 bg-[#1A110E] p-6 sm:p-8 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-accent mb-2" />
                <h2 className="font-heading text-xl font-bold text-ink">
                  Personal Styling & Fit Consultation
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted max-w-lg mx-auto">
                  Unsure which size fits your silhouette best? Message us directly on WhatsApp with your height and weight for tailored fit recommendations.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {page.sections.map((section, idx) => (
                <article
                  key={idx}
                  className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft"
                >
                  <h2 className="font-heading text-xl font-bold text-ink">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
