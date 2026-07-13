import app from "./app";
import config from "./config/index";
import "dotenv/config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Only start the local server when NOT running on Vercel serverless.
// On Vercel, the function entry (api/index.ts) exports the Express app directly.
if (!process.env.VERCEL) {
  main();
}
