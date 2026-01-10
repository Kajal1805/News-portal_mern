import { ID, ImageGravity } from "appwrite";
import { storage, appwriteConfig } from "./config";




export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile; // ✅ Must return
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// ✅ Get file preview URL
export function getFilePreview(fileId) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    return fileUrl.href; // ✅ return usable URL
  } catch (error) {
    console.error("Preview error:", error);
    return null;
  }
}