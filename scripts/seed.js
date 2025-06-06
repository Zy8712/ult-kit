// scripts/seed.js

import 'dotenv/config';
import { db } from '../src/db'; // Adjust path to your Drizzle client instance if needed
import { tools as toolsTableSchema } from '../src/db/schema'; // Adjust path to your schema
import fs from 'fs/promises';
import path from 'path';

// Helper to convert empty strings or invalid dates to null for timestamp fields
const parseOptionalDate = (dateString) => {
  if (!dateString || dateString.trim() === "") return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper to safely convert values to strings, handling null/undefined
const safeString = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
};

// Helper to safely convert numeric values
const safeNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Helper for decimal numbers (ratings) - rounds to 1 decimal place
const safeDecimal = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  return Math.round(num * 10) / 10; // Ensures max 1 decimal place
};

// Helper to ensure arrays are properly formatted
const safeArray = (value) => {
  if (!value || !Array.isArray(value)) return [];
  return value.filter(item => item !== null && item !== undefined && item !== "");
};

const seed = async () => {
  try {
    const filePath = path.join(process.cwd(), './src/data/all-sites.json');
    const toolsDataRaw = await fs.readFile(filePath, 'utf-8');
    const toolsArray = JSON.parse(toolsDataRaw);

    if (!toolsArray || toolsArray.length === 0) {
      console.log('No tools found in JSON file or file is empty.');
      return;
    }

    console.log(`Found ${toolsArray.length} tools in JSON file. Starting to seed tools...`);

    // Process each tool with better error handling
    for (let i = 0; i < toolsArray.length; i++) {
      const tool = toolsArray[i];
      
      try {
        const toolToInsert = {
          // Database structure not available in public preview.
          // Code for database seeding only available in private ver.
          // This is for security purposes.
          // Contact me if you'd like further details.
        };

        // Insert with conflict handling
        await db.insert(toolsTableSchema)
          .values(toolToInsert)
          .onConflictDoUpdate({
            target: toolsTableSchema.id,
            set: { 
              ...toolToInsert, 
              id: undefined, 
              updatedAt: new Date() 
            }
          });

        console.log(`✅ Seeded/Updated tool: ${toolToInsert.name} (ID: ${toolToInsert.id})`);
        
      } catch (toolError) {
        console.error(`❌ Error processing tool at index ${i} (${tool.primary_details?.name || 'Unknown'}):`, toolError);
        console.error('Tool data:', JSON.stringify(tool, null, 2));
        // Continue with next tool instead of stopping entirely
        continue;
      }
    }

    console.log(`✅ Successfully processed ${toolsArray.length} tools.`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Fatal error seeding tools:', error);
    process.exit(1);
  }
};

seed();