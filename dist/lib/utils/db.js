"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// path: src/utils/db.ts
var client_1 = require("@prisma/client");
var serverless_1 = require("@neondatabase/serverless");
var adapter_neon_1 = require("@prisma/adapter-neon");
var ws_1 = require("ws");
// Function to create PrismaClient with Neon adapter
var createPrismaClient = function () {
    // Setup
    serverless_1.neonConfig.webSocketConstructor = ws_1.default;
    var connectionString = "".concat(process.env.DATABASE_URL);
    // Init prisma client
    var pool = new serverless_1.Pool({ connectionString: connectionString });
    var adapter = new adapter_neon_1.PrismaNeon(pool);
    var prisma = new client_1.PrismaClient({ adapter: adapter });
    // Return the PrismaClient instance
    return prisma;
};
// Create a PrismaClient instance
var prisma = global.prisma || (global.prisma = createPrismaClient());
// Export the Prisma instance
exports.default = prisma;
// Ensure no global pollution in production
if (process.env.NODE_ENV === "production") {
    global.prisma = undefined;
}
