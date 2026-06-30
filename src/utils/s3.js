import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

function getS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
}

export async function uploadToS3(fileBuffer, originalName, mimeType) {
    const fileKey = Date.now().toString() + "-" + originalName;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: "public-read",
    };

    const s3Client = getS3Client();
    await s3Client.send(new PutObjectCommand(params));

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { 
        url: url, 
        key: fileKey 
    };
}

export async function deleteFromS3(fileKey) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
  };

  const s3Client = getS3Client();
  await s3Client.send(new DeleteObjectCommand(params));
}