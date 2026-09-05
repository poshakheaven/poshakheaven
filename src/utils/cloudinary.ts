import { sanitizeText } from "./format";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export interface CloudinaryError {
  message: string;
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in environment variables."
    );
  }

  return { cloudName, uploadPreset };
}

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "poshakheaven/products");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Upload failed: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (onProgress) {
    onProgress(100);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

export async function uploadMultipleImagesToCloudinary(
  files: File[],
  onProgress?: (index: number, progress: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const result = await uploadImageToCloudinary(file, (progress) => {
        onProgress?.(i, progress);
      });
      urls.push(result.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      throw new Error(`Failed to upload ${file.name}: ${message}`);
    }
  }

  return urls;
}

export function validateImageFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }

  if (file.size > maxSize) {
    return "Image size must be less than 10MB.";
  }

  return null;
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
