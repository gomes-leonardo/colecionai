import { v2 as cloudinary } from "cloudinary";
import { IStorageProvider } from "../IStorageProvider";
import * as fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

export class CloudinaryStorageProvider implements IStorageProvider {
  async saveFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        async (error, result) => {
          if (error) {
            if (file.path) {
              unlinkAsync(file.path).catch(() => {});
            }
            return reject(error);
          }

          if (!result?.secure_url) {
            if (file.path) {
              unlinkAsync(file.path).catch(() => {});
            }
            return reject(new Error("Upload failed: no URL returned"));
          }

          if (file.path) {
            try {
              await unlinkAsync(file.path);
            } catch (err) {
              console.warn("Failed to delete temporary file:", err);
            }
          }

          resolve(result.secure_url);
        }
      );

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        const readStream = fs.createReadStream(file.path);
        readStream.on("error", (err) => {
          reject(err);
        });
        readStream.pipe(uploadStream);
      } else {
        reject(new Error("File has no buffer or path"));
      }
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl || !fileUrl.includes("cloudinary.com")) {
      return;
    }

    try {
      const publicId = this.extractPublicId(fileUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      
      if (uploadIndex === -1) {
        return null;
      }
      
      const pathAfterUpload = urlParts.slice(uploadIndex + 1);
      const versionIndex = pathAfterUpload.findIndex(part => /^v\d+$/.test(part));
      const pathWithoutVersion = versionIndex !== -1 
        ? pathAfterUpload.slice(versionIndex + 1)
        : pathAfterUpload;
      
      const fullPath = pathWithoutVersion.join("/");
      const publicIdWithoutExtension = fullPath.replace(/\.[^/.]+$/, "");
      
      return publicIdWithoutExtension || null;
    } catch {
      return null;
    }
  }
}
