// drizzle.config.js
import 'dotenv/config'; // Make sure to install dotenv: npm install dotenv

export default {
    schema: './src/db/schema.js', // Path to your schema file
    out: './src/db/migrations', // Directory for migrations
    driver: 'pglite',
    dialect: 'postgresql',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL, // Your Neon connection string
    },
};