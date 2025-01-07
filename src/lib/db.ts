// path: src/utils/db.ts
import { PrismaClient } from "@prisma/client";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Function to create PrismaClient with Neon adapter
const createPrismaClient = () => {
    // Setup
    neonConfig.webSocketConstructor = ws;
    const connectionString = `${process.env.DATABASE_URL}`;

    // Init prisma client
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    const prisma = new PrismaClient({ adapter });

    // Return the PrismaClient instance
    return prisma;
};

// Global declaration to prevent multiple instances
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Create a PrismaClient instance
const prisma = global.prisma || (global.prisma = createPrismaClient());

// Export the Prisma instance
export default prisma;

// Ensure no global pollution in production
if (process.env.NODE_ENV === "production") {
    global.prisma = undefined;
}
