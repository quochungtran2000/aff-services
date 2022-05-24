import {Injectable, Logger} from "@nestjs/common";
import {UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary} from 'cloudinary'
import {Express} from "express";

@Injectable()
export class CloudinaryService {
  private readonly cloudinary: any;
  private readonly logger = new Logger(`API-Gateway.CloudinaryService.${CloudinaryService.name}`);
  constructor() {
    this.logger.log(`Setting up for Cloudinary: `)
    this.cloudinary = cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key:  process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true
    })
  }

  async uploadImage(file: Express.Multer.File) : Promise<UploadApiResponse> {
    const { UploadApiResponse } = await this.cloudinary.uploader.upload(file, (err: UploadApiErrorResponse, res: UploadApiResponse) => {
      if (!err) {
        this.logger.log(`Upload has some problem ${err.name} - ${err.message} - ${err.http_code}`)
      }
      console.log(`Upload Success - ${res.url}`)
    })

    return UploadApiResponse;
  }
}
