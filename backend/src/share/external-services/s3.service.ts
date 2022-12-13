import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export type fileUpload = {
  Location: string;
};

export const bucketName = process.env.Bucket_Name;

@Injectable()
export class FileUploadService {
  async uploadS3(file: Express.Multer.File, bucket: string, name) {
    const s3 = this.getS3();
    const base64data = file.buffer;
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: base64data,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data: fileUpload) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data.Location);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
  }
}
