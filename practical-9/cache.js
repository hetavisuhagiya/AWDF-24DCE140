const NodeCache = require("node-cache");

// Cache data for 60 seconds
const cache = new NodeCache({
    stdTTL: 60
});

module.exports = cache;