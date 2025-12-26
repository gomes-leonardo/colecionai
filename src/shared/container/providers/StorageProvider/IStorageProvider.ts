export interface IStorageProvider {
  saveFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}
