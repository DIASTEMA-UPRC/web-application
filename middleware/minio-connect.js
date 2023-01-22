const Minio = require('minio');
const {MINIO_URL,MINIO_PORT,MINIO_ACCESS_KEY,MINIO_SECRET_KEY} = require('../config/config');

try {
    minioClient = new Minio.Client({
        endPoint:MINIO_URL,
        port: MINIO_PORT,
        useSSL:false,
        accessKey: MINIO_ACCESS_KEY,
        secretKey: MINIO_SECRET_KEY
    });
} catch (error) {
    console.log(error);
}

module.exports = minioClient