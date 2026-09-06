import {
  Check,
  Edit3,
  FolderPlus,
  Image as ImageIcon,
  Layers,
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
import type { Category, Product, ProductColor, ProductDraft, ProductTag } from "../types";
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  validateImageFile
} from "../utils/cloudinary";
import { formatCurrency, slugify } from "../utils/format";

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

const initialCategoryDraft: Category = {
  name: "",
  slug: "",
  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=82",
  summary: ""
};

export function AdminProducts() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    clearAllProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories
  } = useStore();

  const [form, setForm] = useState<ProductDraft>(initialProductDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Category>(initialCategoryDraft);
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [isCatUploading, setIsCatUploading] = useState(false);
  const [catFeedback, setCatFeedback] = useState("");

  // Filtered product listing
  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory =
        selectedCategoryFilter === "All" ||
        p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, query, selectedCategoryFilter]);

  // Count products per category
  const productCountPerCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

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
      updateProduct({
        ...finalForm,
        id: editingId,
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      });
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

  // Category Manager Handlers
  const handleCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const slug = categoryForm.slug.trim() || slugify(categoryForm.name);
    const categoryToSave: Category = {
      ...categoryForm,
      name: categoryForm.name.trim(),
      slug
    };

    if (editingCategorySlug) {
      updateCategory(editingCategorySlug, categoryToSave);
      setCatFeedback("Category updated successfully.");
    } else {
      addCategory(categoryToSave);
      setCatFeedback("New category created successfully.");
    }

    setCategoryForm(initialCategoryDraft);
    setEditingCategorySlug(null);
    setTimeout(() => setCatFeedback(""), 3000);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategorySlug(cat.slug);
    setCategoryForm(cat);
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategorySlug(null);
    setCategoryForm(initialCategoryDraft);
  };

  const handleCategoryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      alert(err);
      return;
    }

    setIsCatUploading(true);
    try {
      const res = await uploadImageToCloudinary(file);
      const url = res.url;
      setCategoryForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      alert("Failed to upload image. You can still paste an image link.");
    } finally {
      setIsCatUploading(false);
    }
  };

  return (
    <>
      <Meta
        title="Manage Products"
        description="Add, edit, and organize PoshakHeaven luxury fashion items and categories."
      />
      <AdminShell title="Product Catalogue" eyebrow="Inventory">
        {feedback && (
          <div className="mb-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 animate-fade-in">
            ✓ {feedback}
          </div>
        )}

        {/* Top Action Bar: Categories Manager & Summary */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#1A110E] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm bg-accent/15 text-accent">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Categories & Collections ({categories.length})
              </h3>
              <p className="text-xs text-muted">
                Manage dynamic categories, banners, and catalogue taxonomy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-sm bg-accent px-4 text-xs font-bold text-background transition hover:bg-accent/90"
            >
              <FolderPlus className="h-4 w-4" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

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

            {/* Dynamic Category Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[11px] text-accent hover:underline"
                >
                  + Add Category
                </button>
              </div>
              <CustomSelect
                value={form.category}
                onChange={(val) => updateDraft("category", val)}
                options={categories.map((c) => ({
                  value: c.name,
                  label: `${c.name} (${productCountPerCategory[c.name] || 0})`
                }))}
                className="h-11"
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
                placeholder="E.g. 240 GSM Combed Interlock"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div className="sm:col-span-1 lg:col-span-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Care Instructions
              </label>
              <input
                type="text"
                value={form.care}
                onChange={(e) => updateDraft("care", e.target.value)}
                placeholder="E.g. Machine wash cold, dry flat"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Sizes and Tags */}
          <div className="grid gap-6 sm:grid-cols-2 border-t border-white/10 pt-5">
            {/* Sizes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const active = form.sizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`h-9 min-w-9 rounded-sm px-3 text-xs font-semibold transition ${
                        active
                          ? "bg-accent text-background font-bold"
                          : "border border-white/10 bg-[#120B09] text-muted hover:text-ink hover:border-white/25"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                Curation Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((t) => {
                  const active = form.tags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-xs font-semibold uppercase transition ${
                        active
                          ? "bg-accent text-background font-bold"
                          : "border border-white/10 bg-[#120B09] text-muted hover:text-ink hover:border-white/25"
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Color Variations
              </label>
              <button
                type="button"
                onClick={addColor}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Color</span>
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
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateColor(i, "name", e.target.value)}
                    placeholder="Color Name"
                    className="h-8 flex-1 bg-transparent px-2 text-xs text-ink outline-none"
                  />
                  {form.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="p-1 text-muted hover:text-rose-400 transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload / URLs */}
          <div className="border-t border-white/10 pt-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Gallery Imagery
                </label>
                <p className="text-[11px] text-muted/80">
                  Upload directly or paste image URLs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-3.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-background ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload Cloudinary"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <button
                  type="button"
                  onClick={addImageField}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-white/10 bg-[#120B09] px-3 text-xs font-semibold text-muted hover:text-ink hover:border-white/25 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add URL Field</span>
                </button>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
                {uploadError}
              </p>
            )}

            <div className="space-y-2">
              {form.images.map((imgUrl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded border border-white/10 bg-[#120B09]">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted/40" />
                    )}
                  </div>
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 flex-1 rounded-sm border border-white/15 bg-[#120B09] px-3 text-xs text-ink outline-none focus:border-accent"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="grid h-10 w-10 flex-none place-items-center rounded-sm border border-white/10 text-muted hover:border-rose-500 hover:text-rose-400 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="h-10 rounded-sm border border-white/10 bg-transparent px-5 text-xs font-semibold text-muted hover:text-ink transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft hover:bg-accent/90 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{editingId ? "Save Silhouette Updates" : "Publish to Storefront"}</span>
            </button>
          </div>
        </form>

        {/* Existing Products Catalogue */}
        <section className="mt-10 rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
            <div>
              <h2 className="font-heading text-xl font-bold text-ink">
                Live Inventory ({filteredProducts.length})
              </h2>
              <p className="text-xs text-muted">
                Filter by categories, search items, or edit price & stock
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-9 w-full rounded-sm border border-white/15 bg-[#120B09] pl-9 pr-3 text-xs text-ink outline-none focus:border-accent"
                />
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (confirm("Clear all products from catalogue? You will start with an empty store.")) {
                    await clearAllProducts();
                    setFeedback("All products removed.");
                    setTimeout(() => setFeedback(""), 3000);
                  }
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-rose-500/20 bg-rose-500/10 px-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
                title="Clear all products"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Reset catalogue to default seed products?")) {
                    await resetProducts();
                    setFeedback("Catalogue reset to default demo items.");
                    setTimeout(() => setFeedback(""), 3000);
                  }
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white/10 bg-[#120B09] px-3 text-xs font-semibold text-muted hover:text-ink transition hover:border-white/30"
                title="Reset demo catalogue"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Menu / Tabs */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter("All")}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition flex-none ${
                selectedCategoryFilter === "All"
                  ? "bg-accent text-background font-bold shadow-soft"
                  : "border border-white/10 bg-[#120B09] text-muted hover:text-ink hover:border-white/20"
              }`}
            >
              <span>All Products</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                {products.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategoryFilter === cat.name;
              const count = productCountPerCategory[cat.name] || 0;
              return (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => setSelectedCategoryFilter(cat.name)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition flex-none ${
                    isActive
                      ? "bg-accent text-background font-bold shadow-soft"
                      : "border border-white/10 bg-[#120B09] text-muted hover:text-ink hover:border-white/20"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? "bg-black/20 text-background" : "bg-white/10 text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-dashed border-accent/40 bg-accent/5 px-3 text-xs font-semibold text-accent hover:bg-accent/15 transition flex-none"
            >
              <Plus className="h-3 w-3" />
              <span>Manage Categories</span>
            </button>
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">
                      No products found in this filter.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
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
                        <td className="py-3 px-3">
                          <span className="inline-block rounded bg-white/5 px-2 py-0.5 text-[11px] text-muted">
                            {p.category}
                          </span>
                        </td>
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Category Management Modal Drawer */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-lg border border-white/15 bg-[#170E0B] p-6 shadow-2xl space-y-6 animate-fade-in my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <h3 className="font-heading text-lg font-bold text-ink">
                    {editingCategorySlug ? "Edit Category" : "Manage Store Categories"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    handleCancelCategoryEdit();
                  }}
                  className="rounded p-1 text-muted hover:bg-white/10 hover:text-ink transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {catFeedback && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
                  ✓ {catFeedback}
                </div>
              )}

              {/* Add / Edit Category Form */}
              <form
                onSubmit={handleCategorySubmit}
                className="rounded-md border border-white/10 bg-[#120B09] p-4 space-y-4"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {editingCategorySlug ? "Update Category Details" : "+ Add New Category"}
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-muted block mb-1">
                      Category Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                          slug: editingCategorySlug ? prev.slug : slugify(e.target.value)
                        }))
                      }
                      placeholder="E.g. Panjabi, Denim Jackets"
                      className="h-10 w-full rounded-sm border border-white/15 bg-[#1A110E] px-3 text-xs text-ink outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-muted block mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                      }
                      placeholder="e.g. panjabi"
                      className="h-10 w-full rounded-sm border border-white/15 bg-[#1A110E] px-3 text-xs font-mono text-ink outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-muted block mb-1">
                    Short Summary / Description
                  </label>
                  <input
                    type="text"
                    value={categoryForm.summary}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, summary: e.target.value }))
                    }
                    placeholder="E.g. Premium festive and occasion wear silhouettes."
                    className="h-10 w-full rounded-sm border border-white/15 bg-[#1A110E] px-3 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold uppercase text-muted">
                      Category Banner Image
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-accent hover:underline">
                      {isCatUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryFileUpload}
                        className="hidden"
                        disabled={isCatUploading}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded border border-white/10 bg-[#1A110E]">
                      {categoryForm.image ? (
                        <img
                          src={categoryForm.image}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted" />
                      )}
                    </div>
                    <input
                      type="url"
                      value={categoryForm.image}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({ ...prev, image: e.target.value }))
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="h-10 flex-1 rounded-sm border border-white/15 bg-[#1A110E] px-3 text-xs text-ink outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {editingCategorySlug && (
                    <button
                      type="button"
                      onClick={handleCancelCategoryEdit}
                      className="h-9 rounded-sm border border-white/10 px-4 text-xs font-semibold text-muted hover:text-ink transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-accent px-5 text-xs font-bold text-background transition hover:bg-accent/90"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{editingCategorySlug ? "Save Category Changes" : "Create Category"}</span>
                  </button>
                </div>
              </form>

              {/* List of Existing Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                    Current Categories ({categories.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Reset categories back to defaults?")) resetCategories();
                    }}
                    className="text-[11px] text-muted hover:text-rose-400 transition"
                  >
                    Reset Categories
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {categories.map((cat) => {
                    const count = productCountPerCategory[cat.name] || 0;
                    return (
                      <div
                        key={cat.slug}
                        className="flex items-center justify-between gap-3 rounded-sm border border-white/10 bg-[#120B09] p-2.5 hover:border-white/20 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-10 w-10 rounded object-cover border border-white/10 flex-none"
                          />
                          <div>
                            <p className="text-xs font-bold text-ink flex items-center gap-2">
                              <span>{cat.name}</span>
                              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[10px] text-muted font-normal">
                                {count} products
                              </span>
                            </p>
                            <p className="font-mono text-[10px] text-muted">/{cat.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(cat)}
                            className="grid h-7 w-7 place-items-center rounded border border-white/10 text-muted hover:border-accent hover:text-accent transition"
                            title="Edit Category"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete category "${cat.name}"? Products in this category will not be deleted.`)) {
                                deleteCategory(cat.slug);
                              }
                            }}
                            className="grid h-7 w-7 place-items-center rounded border border-white/10 text-muted hover:border-rose-500 hover:text-rose-400 transition"
                            title="Delete Category"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}
