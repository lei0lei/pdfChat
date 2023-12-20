import { NextResponse } from 'next/server';
const { BlobServiceClient } = require('@azure/storage-blob');

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
   
    // 移除 BASE64 头部信息
    const base64Data = body.file.replace(/^data:.+;base64,/, "");

    const blobServiceClient = BlobServiceClient.fromConnectionString('your-azure-connection-string');
    const containerClient = blobServiceClient.getContainerClient('your-blob-container-name');
    const blockBlobClient = containerClient.getBlockBlobClient(body.blobName);
   
    try {
        // 上传到Azure
        const response = await blockBlobClient.upload(Buffer.from(base64Data, 'base64'), base64Data.length, { blobHTTPHeaders: { blobContentType: body.contentType }});

        return NextResponse.json({
            url: blockBlobClient.url,
            etag: response.etag
        });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 400 });
    }
}