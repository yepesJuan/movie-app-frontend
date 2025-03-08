export async function uploadImageToS3(file: File): Promise<string> {
  const response = await fetch("/api/getPresignedUrl", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
    headers: { "Content-Type": "application/json" },
  });

  const { uploadUrl, fileUrl } = await response.json();

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  return fileUrl;
}
