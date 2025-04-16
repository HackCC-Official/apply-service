import { Inject, Injectable } from "@nestjs/common";
import { MINIO_CONNECTION } from "nestjs-minio";
import { Client } from 'minio'

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client 
  ) {}

  async uploadPdf(filename: string, file: Buffer) {
    await this.minioClient.putObject(
      process.env.MINIO_BUCKET_NAME,
      filename,
      file
    )
  }

  async generatePresignedURL(filename: string): Promise<string> {
    return await this.minioClient.presignedGetObject(
      process.env.MINIO_BUCKET_NAME,
      filename.substring(1),
      3600
    )
  }
}