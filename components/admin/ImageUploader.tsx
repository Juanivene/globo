"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

export interface ProductImageRow {
  id: string;
  url: string;
  position: number;
}

export function ImageUploader({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImageRow[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const presignRes = await fetch(
          `/api/admin/products/${productId}/images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentType: file.type }),
          }
        );
        if (!presignRes.ok) throw new Error();
        const { uploadUrl, key, publicUrl } = await presignRes.json();

        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error();

        const confirmRes = await fetch(
          `/api/admin/products/${productId}/images/confirm`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, url: publicUrl }),
          }
        );
        if (!confirmRes.ok) throw new Error();
        const image = await confirmRes.json();
        setImages((prev) => [...prev, image]);
      } catch {
        toast.error(`No se pudo subir ${file.name}`);
      }
    }

    setUploading(false);
    router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(image: ProductImageRow) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const res = await fetch(
        `/api/admin/products/${productId}/images/${image.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setImages((prev) => prev.filter((i) => i.id !== image.id));
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar la imagen");
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-black/5"
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              sizes="150px"
            />
            <button
              onClick={() => handleDelete(img)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted transition-colors hover:border-glow hover:text-glow disabled:opacity-50 cursor-pointer"
        >
          <Upload size={20} />
          <span className="text-xs">{uploading ? "Subiendo..." : "Subir"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
