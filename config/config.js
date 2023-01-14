module.exports = {
    MONGO_URL: process.env.MONGO_URL || "mongo",

    MINIO_URL: process.env.MINIO_URL,
    MINIO_PORT: 9000,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,

    PORT: process.env.PORT || 5400,

    ORCHESTRATOR_URL: process.env.ORCHESTRATOR_URL,
    ORCHESTRATOR_INGESTION_URL: process.env.ORCHESTRATOR_INGESTION_URL,

    NORMALIZATION_URL: process.env.NORMALIZATION_URL,
    VALIDATION_URL: process.env.VALIDATION_URL,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
}