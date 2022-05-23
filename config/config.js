module.exports = {
    MONGO_URL: process.env.MONGO_URL || "mongo",
    PORT: process.env.PORT || 6000,
    ORCHESTRATOR_URL: process.env.ORCHESTRATOR_URL,
    ORCHESTRATOR_INGESTION_URL: process.env.ORCHESTRATOR_INGESTION_URL
}