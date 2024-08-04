import { v2 as cloudinary } from "cloudinary";
import { Cloud_Name, API_Key, API_secret } from "./key";

cloudinary.config({
  cloud_name: Cloud_Name,
  api_key: API_Key,
  api_secret: API_secret,
});

export default async function uploadPhoto(photo: any): Promise<string> {
  const base64Image = photo.buffer.toString("base64");

  const image = await cloudinary.uploader.upload(
    `data:${photo.mimetype};base64,${base64Image}`,
    {
      resource_type: "image",
      folder: "blogs",
      public_id: `${photo.originalname.split(".")[0]}-${Date.now()}`,
    }
  );

  return image.secure_url;
}
