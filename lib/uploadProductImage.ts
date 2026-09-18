export interface UploadedProductImage {
  id: string;
  url: string;
  position: number;
}

/**
 * Presigns an R2 upload for `productId`, PUTs the file, then confirms it so
 * a ProductImage row gets created. Shared by the standalone image manager
 * (edit page) and the one-step create form.
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<UploadedProductImage> {
  const presignRes = await fetch(`/api/admin/products/${productId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type }),
  });
  if (!presignRes.ok) throw new Error(`No se pudo preparar la subida de ${file.name}`);
  const { uploadUrl, key, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error(`No se pudo subir ${file.name}`);

  const confirmRes = await fetch(`/api/admin/products/${productId}/images/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, url: publicUrl }),
  });
  if (!confirmRes.ok) throw new Error(`No se pudo confirmar ${file.name}`);
  return confirmRes.json();
}
