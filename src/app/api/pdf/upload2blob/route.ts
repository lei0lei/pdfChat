import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '20mb', // adjust this limit according to your needs.
//     },
//   },
// };

export async function POST(request: Request): Promise<NextResponse> {
    console.log('uploading file')
    try {
    const tmpid = uuidv4()
    const { file, name } = await request.json(); // You need to send file as base64 and name in body
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING||'DefaultEndpointsProtocol=https;AccountName=pdfwithchat;AccountKey=WKOarfs0IGEtgjRm146oCIbO66/iuARzyueR/LreTUi6v1XEAeY7f56fP0uHZ4DLPzf62+RzzhP1+AStSV/9eg==;EndpointSuffix=core.windows.net'
    );
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_CONTAINER_NAME||'pdfchat'
    );
    const blockBlobClient = containerClient.getBlockBlobClient(tmpid+'+'+name);

    const buffer = Buffer.from(file, "base64");
    const uploadBlobResponse = await blockBlobClient.upload(
      buffer,
      buffer.length
    );
    console.log(uploadBlobResponse)
    const jsonResponse = { success: true, data: uploadBlobResponse, url: tmpid+'+'+name}

    return NextResponse.json(jsonResponse);
    // res.status(200).json({ success: true, data: uploadBlobResponse, url: blockBlobClient.url });
  } catch (error) {
    return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }, // The webhook will retry 5 times waiting for a 200
      );
  }
}
