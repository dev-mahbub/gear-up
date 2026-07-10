import app from "./app.js";
import config from "./config/index.js";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";

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

main();
