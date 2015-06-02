var redis = require("redis").createClient(
    process.env.REDIS_PORT_6379_TCP_PORT || 6379,
    process.env.REDIS_PORT_6379_TCP_ADDR || "redis",
    {
        auth_pass: process.env.REDIS_PASSWORD || null
    }
);
module.exports = redis;
