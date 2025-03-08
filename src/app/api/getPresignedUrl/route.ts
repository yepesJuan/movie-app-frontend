/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({ region: "us-east-1" });

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();
    const bucketName =
      "awsmovieappbackendstack-movieimagebucket192c917f-85wbjm2yrjnf";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `movies/${filename}`,
      ContentType: contentType,
      // ACL: "public-read",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); //604800 = 1 week

    const fileUrl = `https://${bucketName}.s3.amazonaws.com/movies/${filename}`;

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error, message: "Error generating presigned URL" },
      { status: 500 }
    );
  }
}
