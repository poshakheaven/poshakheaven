import {
  Gift,
  Globe,
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  Save,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Upload
} from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import { defaultSiteContent } from "../data/defaultContent";
import type { SiteContent } from "../types";
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  validateImageFile
} from "../utils/cloudinary";

export function AdminBanners() {
  const { siteContent, updateSiteContent, resetSiteContent } = useStore();
  const [form, setForm] = useState<SiteContent>(siteContent);
  const [activeTab, setActiveTab] = useState<
    "hero" | "campaign" | "store" | "delivery"
  >("hero");
  const [savedMessage, setSavedMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    setForm((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value }
    }));
  };

  const updateCampaign = (
    field: keyof SiteContent["campaign"],
    value: unknown
  ) => {
    setForm((current) => ({
      ...current,
      campaign: { ...current.campaign, [field]: value }
    }));
  };

  const updateStoreInfo = (
    field: keyof SiteContent["storeInfo"],
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      storeInfo: { ...current.storeInfo, [field]: value }
    }));
  };

  const updateDelivery = (
    field: keyof SiteContent["delivery"],
    value: number
  ) => {
    setForm((current) => ({
      ...current,
      delivery: { ...current.delivery, [field]: value }
    }));
  };

  const updateBulkDiscount = (
    field: keyof SiteContent["bulkDiscount"],
    value: unknown
  ) => {
    setForm((current) => ({
      ...current,
      bulkDiscount: { ...current.bulkDiscount, [field]: value }
    }));
  };

  const handleHeroFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      setUploadError(err);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const res = await uploadImageToCloudinary(file);
      updateHero("image", res.url);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Cloudinary upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCampaignFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      setUploadError(err);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const res = await uploadImageToCloudinary(file);
      const updated = [...form.campaign.images];
      updated[index] = res.url;
      updateCampaign("images", updated);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Cloudinary upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateSiteContent(form);
    setSavedMessage("Website content updated live across storefront.");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all banners and store settings to defaults?")) {
      resetSiteContent();
      setForm(defaultSiteContent);
      setSavedMessage("Reset to defaults.");
      setTimeout(() => setSavedMessage(""), 3000);
    }
  };

  return (
    <>
      <Meta
        title="Banners & Content Customizer"
        description="Customize PoshakHeaven storefront banners, delivery rates, and promotions."
      />
      <AdminShell title="Storefront Customizer" eyebrow="Content & Settings">
        {savedMessage && (
          <div className="mb-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 animate-fade-in">
            ✓ {savedMessage}
          </div>
        )}

        {uploadError && (
          <div className="mb-6 rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
            {uploadError}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-wide transition ${
              activeTab === "hero"
                ? "bg-accent text-background font-bold shadow-soft"
                : "border border-white/10 bg-[#1A110E] text-muted hover:text-ink"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hero Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("campaign")}
            className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-wide transition ${
              activeTab === "campaign"
                ? "bg-accent text-background font-bold shadow-soft"
                : "border border-white/10 bg-[#1A110E] text-muted hover:text-ink"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Lookbook Campaign (4 Images)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-wide transition ${
              activeTab === "store"
                ? "bg-accent text-background font-bold shadow-soft"
                : "border border-white/10 bg-[#1A110E] text-muted hover:text-ink"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Store Info & Payments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-wide transition ${
              activeTab === "delivery"
                ? "bg-accent text-background font-bold shadow-soft"
                : "border border-white/10 bg-[#1A110E] text-muted hover:text-ink"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Delivery & Bulk Discounts</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-5">
              <h2 className="font-heading text-xl font-bold text-ink border-b border-white/10 pb-4">
                Homepage Hero Section
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Hero Badge Label
                  </label>
                  <input
                    type="text"
                    value={form.hero.badge}
                    onChange={(e) => updateHero("badge", e.target.value)}
                    placeholder="E.g. Autumn Edit 2026"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Main Headline Title
                  </label>
                  <input
                    type="text"
                    value={form.hero.title}
                    onChange={(e) => updateHero("title", e.target.value)}
                    placeholder="E.g. PoshakHeaven"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Hero Editorial Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={form.hero.subtitle}
                    onChange={(e) => updateHero("subtitle", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-[#120B09] p-3 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                {/* Hero Image */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Hero Banner Image URL
                    </label>
                    <label className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/15 px-3 text-xs font-semibold text-accent cursor-pointer hover:bg-accent hover:text-background transition">
                      {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      <span>Upload Hero Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={form.hero.image}
                    onChange={(e) => updateHero("image", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
                  />
                  {form.hero.image && (
                    <div className="aspect-[21/9] max-h-48 overflow-hidden rounded-md border border-white/10 mt-2">
                      <img
                        src={form.hero.image}
                        alt="Hero preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Primary Button */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.hero.primaryButtonText}
                    onChange={(e) => updateHero("primaryButtonText", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.hero.primaryButtonLink}
                    onChange={(e) => updateHero("primaryButtonLink", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                {/* Secondary Button */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.hero.secondaryButtonText}
                    onChange={(e) => updateHero("secondaryButtonText", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={form.hero.secondaryButtonLink}
                    onChange={(e) => updateHero("secondaryButtonLink", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN / LOOKBOOK */}
          {activeTab === "campaign" && (
            <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-5">
              <h2 className="font-heading text-xl font-bold text-ink border-b border-white/10 pb-4">
                Lookbook & Campaign Story Section
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Campaign Eyebrow
                  </label>
                  <input
                    type="text"
                    value={form.campaign.eyebrow}
                    onChange={(e) => updateCampaign("eyebrow", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    value={form.campaign.title}
                    onChange={(e) => updateCampaign("title", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Campaign Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.campaign.description}
                    onChange={(e) => updateCampaign("description", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-[#120B09] p-3 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={form.campaign.buttonText}
                    onChange={(e) => updateCampaign("buttonText", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={form.campaign.buttonLink}
                    onChange={(e) => updateCampaign("buttonLink", e.target.value)}
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                {/* 4 Lookbook Photos */}
                <div className="sm:col-span-2 border-t border-white/10 pt-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
                    Lookbook Editorial Images (4 Photo Grid)
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-white/10 bg-[#120B09] p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-accent">
                            Photo #{idx + 1}
                          </span>
                          <label className="text-[10px] text-accent hover:underline cursor-pointer">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCampaignFileUpload(e, idx)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <input
                          type="url"
                          value={form.campaign.images[idx] || ""}
                          onChange={(e) => {
                            const updated = [...form.campaign.images];
                            updated[idx] = e.target.value;
                            updateCampaign("images", updated);
                          }}
                          placeholder="https://..."
                          className="h-9 w-full rounded-sm border border-white/15 bg-[#1A110E] px-2.5 text-xs font-mono text-ink outline-none focus:border-accent"
                        />
                        {form.campaign.images[idx] && (
                          <img
                            src={form.campaign.images[idx]}
                            alt={`Preview ${idx + 1}`}
                            className="aspect-[3/4] h-28 rounded object-cover border border-white/10"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORE INFO & BKASH */}
          {activeTab === "store" && (
            <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-5">
              <h2 className="font-heading text-xl font-bold text-ink border-b border-white/10 pb-4">
                Store Credentials & Direct Contact
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Official bKash Merchant / Personal Number *
                  </label>
                  <input
                    type="tel"
                    value={form.storeInfo.merchantBkashNumber}
                    onChange={(e) => updateStoreInfo("merchantBkashNumber", e.target.value)}
                    placeholder="01970430152"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-accent font-bold outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    WhatsApp Concierge Hotline Number *
                  </label>
                  <input
                    type="tel"
                    value={form.storeInfo.whatsappNumber}
                    onChange={(e) => updateStoreInfo("whatsappNumber", e.target.value)}
                    placeholder="01970430152"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={form.storeInfo.email}
                    onChange={(e) => updateStoreInfo("email", e.target.value)}
                    placeholder="poshakheaven.info@gmail.com"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Instagram Handle or URL
                  </label>
                  <input
                    type="text"
                    value={form.storeInfo.instagramUrl}
                    onChange={(e) => updateStoreInfo("instagramUrl", e.target.value)}
                    placeholder="https://www.instagram.com/poshakheaven"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Boutique Headquarters Location
                  </label>
                  <input
                    type="text"
                    value={form.storeInfo.location}
                    onChange={(e) => updateStoreInfo("location", e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Footer Brand Statement
                  </label>
                  <textarea
                    rows={2}
                    value={form.storeInfo.footerAbout}
                    onChange={(e) => updateStoreInfo("footerAbout", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-[#120B09] p-3 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY & BULK DISCOUNTS */}
          {activeTab === "delivery" && (
            <div className="space-y-6">
              {/* Delivery Rates */}
              <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Truck className="h-5 w-5 text-accent" />
                  <h2 className="font-heading text-xl font-bold text-ink">
                    Courier Delivery Charges
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Inside Dhaka Rate (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.delivery.insideDhakaRate}
                      onChange={(e) => updateDelivery("insideDhakaRate", Number(e.target.value))}
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Outside Dhaka Rate (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.delivery.outsideDhakaRate}
                      onChange={(e) => updateDelivery("outsideDhakaRate", Number(e.target.value))}
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Free Delivery Minimum Spend (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.delivery.freeDeliveryMinAmount}
                      onChange={(e) => updateDelivery("freeDeliveryMinAmount", Number(e.target.value))}
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-accent font-bold outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Spend Discount */}
              <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Gift className="h-5 w-5 text-accent" />
                  <h2 className="font-heading text-xl font-bold text-ink">
                    VIP Bulk Spend Discount (e.g. ৳5,000+ Cart)
                  </h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={form.bulkDiscount.enabled}
                      onChange={(e) => updateBulkDiscount("enabled", e.target.checked)}
                      className="h-4 w-4 rounded accent-[#D6B49A]"
                    />
                    <span>Enable Automatic Bulk Spend Discount Campaign</span>
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                        Minimum Cart Spend Threshold (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.bulkDiscount.minSpend}
                        onChange={(e) => updateBulkDiscount("minSpend", Number(e.target.value))}
                        className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                        Discount Percentage (% OFF)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={form.bulkDiscount.discountPercentage}
                        onChange={(e) => updateBulkDiscount("discountPercentage", Number(e.target.value))}
                        className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-accent font-bold outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1A110E] p-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-white/20 px-4 text-xs font-semibold text-muted hover:text-ink"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-8 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
            >
              <Save className="h-4 w-4" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </AdminShell>
    </>
  );
}
