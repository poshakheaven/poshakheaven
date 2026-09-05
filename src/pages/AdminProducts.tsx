import {
  Edit3,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { CustomSelect } from "../components/CustomSelect";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/catalog";
import type { Product, ProductColor, ProductDraft, ProductTag } from "../types";
import {
  uploadMultipleImagesToCloudinary,
  validateImageFile
} from "../utils/cloudinary";
import { formatCurrency } from "../utils/format";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const availableTags: ProductTag[] = ["featured", "new", "best"];

const initialProductDraft: ProductDraft = {
  name: "",
  sku: "",
  category: "T-Shirts",
  description: "",
  price: 1500,
  discountPrice: undefined,
  stock: 20,
  images: [""],
  sizes: ["M", "L", "XL"],
  colors: [{ name: "Espresso", value: "#2B1B17" }],
  tags: ["new"],
  material: "240 GSM combed cotton interlock",
  care: "Machine wash gentle in cold water, dry flat in shade, iron inside out."
};

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } =
    useStore();
  const [form, setForm] = useState<ProductDraft>(initialProductDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [feedback, setFeedback] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const updateDraft = (field: keyof ProductDraft, value: unknown) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...form.images];
    updated[index] = val;
    updateDraft("images", updated);
  };

  const addImageField = () => {
    updateDraft("images", [...form.images, ""]);
  };

  const removeImageField = (index: number) => {
    const updated = form.images.filter((_, i) => i !== index);
    updateDraft("images", updated.length ? updated : [""]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const f of files) {
      const err = validateImageFile(f);
      if (err) {
        setUploadError(err);
        return;
      }
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const uploadedUrls = await uploadMultipleImagesToCloudinary(files);
      const existingImages = form.images.filter((url) => url.trim() !== "");
      updateDraft("images", [...existingImages, ...uploadedUrls]);
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "Cloudinary upload failed. You can still paste manual image URLs."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSize = (sz: string) => {
    const exists = form.sizes.includes(sz);
    const updated = exists
      ? form.sizes.filter((s) => s !== sz)
      : [...form.sizes, sz];
    updateDraft("sizes", updated.length ? updated : [sz]);
  };

  const toggleTag = (t: ProductTag) => {
    const exists = form.tags.includes(t);
    const updated = exists ? form.tags.filter((item) => item !== t) : [...form.tags, t];
    updateDraft("tags", updated);
  };

  const addColor = () => {
    updateDraft("colors", [...form.colors, { name: "Ivory", value: "#F3E7DA" }]);
  };

  const removeColor = (idx: number) => {
    const updated = form.colors.filter((_, i) => i !== idx);
    updateDraft("colors", updated.length ? updated : [{ name: "Classic", value: "#2B1B17" }]);
  };

  const updateColor = (idx: number, key: keyof ProductColor, val: string) => {
    const updated = form.colors.map((col, i) =>
      i === idx ? { ...col, [key]: val } : col
    );
    updateDraft("colors", updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanImages = form.images.filter((url) => url.trim() !== "");
    const finalForm: ProductDraft = {
      ...form,
      images: cleanImages.length
        ? cleanImages
        : [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=82"
          ],
      sku: form.sku.trim() || `PH-${Date.now().toString().slice(-4)}`
    };

    if (editingId) {
      updateProduct({ ...finalForm, id: editingId, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
      setFeedback("Product updated successfully.");
    } else {
      addProduct(finalForm);
      setFeedback("New product added to catalogue.");
    }

    setEditingId(null);
    setForm(initialProductDraft);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      images: p.images,
      sizes: p.sizes,
      colors: p.colors,
      tags: p.tags,
      material: p.material,
      care: p.care
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialProductDraft);
  };

  return (
    <>
      <Meta
        title="Manage Products"
        description="Add, edit, and organize PoshakHeaven luxury fashion items."
      />
      <AdminShell title="Product Catalogue" eyebrow="Inventory">
        {feedback && (
          <div className="mb-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 animate-fade-in">
            ✓ {feedback}
          </div>
        )}

        {/* Product Add / Edit Form Drawer */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-xl font-bold text-ink">
                {editingId ? "Edit Silhouette" : "Add New Silhouette"}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-muted hover:text-ink transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Name */}
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Product Title *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => updateDraft("name", e.target.value)}
                placeholder="E.g. Signature Interlock Tee"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs sm:text-sm text-ink outline-none focus:border-accent"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                SKU / Code
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateDraft("sku", e.target.value)}
                placeholder="E.g. PH-TEE-001"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink font-mono outline-none focus:border-accent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Category *
              </label>
              <input
                required
                type="text"
                value={form.category}
                onChange={(e) => updateDraft("category", e.target.value)}
                placeholder="E.g. T-Shirts, Hoodies..."
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Regular Price (৳) *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateDraft("price", Number(e.target.value))}
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Discount Price */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Discount / Sale Price (৳)
              </label>
              <input
                type="number"
                min="0"
                value={form.discountPrice ?? ""}
                onChange={(e) =>
                  updateDraft(
                    "discountPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Optional sale price"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Stock Quantity *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateDraft("stock", Number(e.target.value))}
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs font-mono text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Editorial Description *
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => updateDraft("description", e.target.value)}
                placeholder="Structured drape, fabric texture, and styling advice..."
                className="w-full rounded-sm border border-white/15 bg-[#120B09] p-3 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            {/* Material & Care */}
            <div className="sm:col-span-1 lg:col-span-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Fabric & GSM
              </label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => updateDraft("material", e.target.value)}
                placeholder="E.g. 240 GSM cotton interlock"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div className="sm:col-span-1 lg:col-span-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Wash & Care Instructions
              </label>
              <input
                type="text"
                value={form.care}
                onChange={(e) => updateDraft("care", e.target.value)}
                placeholder="E.g. Cold machine wash, dry in shade..."
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Sizes & Tags */}
          <div className="grid gap-6 sm:grid-cols-2 border-t border-white/10 pt-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => {
                  const active = form.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`h-9 px-3 rounded-sm text-xs font-semibold transition ${
                        active
                          ? "bg-accent text-background font-bold shadow-md"
                          : "border border-white/15 bg-[#120B09] text-muted hover:border-accent"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                Showcase Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((t) => {
                  const active = form.tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`h-9 px-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition ${
                        active
                          ? "bg-accent text-background font-bold shadow-md"
                          : "border border-white/15 bg-[#120B09] text-muted hover:border-accent"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colorways */}
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Colorways
              </label>
              <button
                type="button"
                onClick={addColor}
                className="text-xs font-bold text-accent hover:text-ink transition"
              >
                + Add Color
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {form.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-sm border border-white/10 bg-[#120B09] p-2"
                >
                  <input
                    type="color"
                    value={c.value}
                    onChange={(e) => updateColor(i, "value", e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateColor(i, "name", e.target.value)}
                    placeholder="Color Name"
                    className="flex-1 bg-transparent text-xs text-ink outline-none"
                  />
                  {form.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-muted hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images & Cloudinary Upload */}
          <div className="border-t border-white/10 pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Product Photography (Images)
                </label>
                <p className="text-[11px] text-muted">
                  Upload high-resolution images via Cloudinary or paste direct image URLs.
                </p>
              </div>

              {/* Cloudinary File Upload Input */}
              <label className="inline-flex h-9 items-center gap-2 rounded-sm border border-accent/40 bg-accent/15 px-3 text-xs font-semibold text-accent cursor-pointer hover:bg-accent hover:text-background transition">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 font-medium">{uploadError}</p>
            )}

            <div className="space-y-2">
              {form.images.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://..."
                    className="h-10 flex-1 rounded-sm border border-white/15 bg-[#120B09] px-3 text-xs font-mono text-ink outline-none focus:border-accent"
                  />
                  {url && (
                    <img
                      src={url}
                      alt="preview"
                      className="h-10 w-10 rounded object-cover border border-white/10 flex-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="grid h-10 w-10 place-items-center rounded-sm border border-white/10 text-muted hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-xs font-semibold text-accent hover:text-ink transition"
              >
                + Add Image URL Line
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset seed catalog to defaults?")) resetProducts();
              }}
              className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-white/20 px-4 text-xs font-semibold text-muted hover:text-ink"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Reset Seed Products</span>
            </button>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-8 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
            >
              <span>{editingId ? "Update Silhouette" : "Publish to Catalogue"}</span>
            </button>
          </div>
        </form>

        {/* Existing Products List & Table */}
        <section className="mt-10 rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-ink">
                Active Catalogue Silhouettes ({filteredProducts.length})
              </h2>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, SKU, category..."
                className="h-10 w-full rounded-sm border border-white/15 bg-[#120B09] pl-9 pr-3 text-xs text-ink outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Pricing</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Tags</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const hasDiscount = Boolean(p.discountPrice && p.discountPrice < p.price);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-12 w-12 rounded object-cover border border-white/10 flex-none"
                          />
                          <div>
                            <p className="font-bold text-ink">{p.name}</p>
                            <p className="font-mono text-[10px] text-muted">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted">{p.category}</td>
                      <td className="py-3 px-3 font-mono">
                        {hasDiscount ? (
                          <div>
                            <span className="font-bold text-accent">
                              {formatCurrency(p.discountPrice || 0)}
                            </span>
                            <span className="ml-1.5 text-muted/70 line-through text-[11px]">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-ink">
                            {formatCurrency(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            p.stock > 0
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="grid h-8 w-8 place-items-center rounded-sm border border-white/10 text-muted hover:border-accent hover:text-accent transition"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                            }}
                            className="grid h-8 w-8 place-items-center rounded-sm border border-white/10 text-muted hover:border-rose-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </AdminShell>
    </>
  );
}
