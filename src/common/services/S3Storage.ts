import { FileData, FileStorage } from "../../types/storage";
import { PutObjectCommand, PutObjectCommandInput, S3Client, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3";
import config from "config";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKey"),
                secretAccessKey: config.get("s3.secretKey"),
            }
        })
    }
    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.bucket"),
            Key: data.fileName,
            Body: data.fileData,
        }
        await this.client.send(new PutObjectCommand(objectParams as unknown as PutObjectCommandInput));
    }
    
    
    async delete(fileName: string): Promise<void> {
      const objectParams = {
        Bucket: config.get("s3.bucket"),
        Key: fileName
      }
      await this.client.send(new DeleteObjectCommand(objectParams as unknown as DeleteObjectCommandInput)); 
    }

    getObjectUri(fileName: string): string {
        const bucket = config.get<string>("s3.bucket");
        const region = config.get<string>("s3.region");
        return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
    }
}