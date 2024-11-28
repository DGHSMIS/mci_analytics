import * as Minio from 'minio';
const minioClient = new Minio.Client({
    endPoint: String(process.env.MINIO_IP),
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: false,
    accessKey: String(process.env.MINIO_USERNAME),
    secretKey: String(process.env.MINIO_PASSWORD)
})

export default minioClient;

// Bucket to read from
export const bucket = String(process.env.MINIO_BUCKET_NAME);


// Function to retrieve an image from a bucket using an identifier
export async function retrieveMinioImageAsBase64(bucketName: string, objectName: string): Promise<string> {
    try {
        const dataStream = await minioClient.getObject(bucketName, objectName);
        const chunks: Uint8Array[] = [];

        return new Promise((resolve, reject) => {
            dataStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            dataStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(base64);
            });

            dataStream.on('error', (err) => {
                resolve("");
            });
        });
    } catch (error: any) {
        console.log(`Error retrieving image: ${error.message}`);
        return "";
    }
}

