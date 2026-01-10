import { Client, Storage } from "appwrite";
import { url } from "zod";

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
};

export const client = new Client()

client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.projectId);
console.log("url:", appwriteConfig.url);

export const storage = new Storage(client);