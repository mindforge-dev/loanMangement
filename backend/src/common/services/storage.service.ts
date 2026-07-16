import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "../../config/s3";

export interface UploadResult {
  objectKey: string;
  bucket: string;
  size: number;
  mimeType: string;
  originalFileName: string;
}

/**
 * Upload a buffer to MinIO and return the object key.
 */
export const uploadFile = async (
  buffer: Buffer,
  originalFileName: string,
  mimeType: string,
  folder = "contracts",
): Promise<UploadResult> => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const objectKey = `${folder}/${uniqueSuffix}-${originalFileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType,
      ContentLength: buffer.length,
    }),
  );

  return {
    objectKey,
    bucket: S3_BUCKET,
    size: buffer.length,
    mimeType,
    originalFileName,
  };
};

export const deleteFile = async (objectKey: string): Promise<void> => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey,
    }),
  );
};

export const getPresignedUrl = async (
  objectKey: string,
  expiresIn = 300,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: objectKey,
  });
  return getSignedUrl(s3, command, { expiresIn });
};
