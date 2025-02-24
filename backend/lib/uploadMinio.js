import minioClient from './minio.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToMinio = async (image, folder) => {
    const base64Pattern = /^data:image\/(png|jpeg|jpg|webp);base64,/;
    const match = image.match(base64Pattern);
    if (!match) {
        throw new Error("Formato de imagen no soportado.");
    }

    const extension = match[1];
    const validExtensions = ['png', 'jpeg', 'jpg', 'webp'];
    if (!validExtensions.includes(extension)) {
        throw new Error("Extension de imagen invalida.");
    }

    const base64Data = image.replace(base64Pattern, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const imageName = `${uuidv4()}.${extension}`;

    const MAX_SIZE = 3 * 1024 * 1024; // 3 MB
    if (buffer.length > MAX_SIZE) {
        throw new Error("Tamaño Imagen excede 3 MB");
    }

    const objectName = `${folder}/${imageName}`;

    await minioClient.putObject(
        process.env.MINIO_BUCKET_NAME,
        objectName,
        buffer,
        { 'Content-Type': `image/${extension}` }
    );

    return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${objectName}`;
};