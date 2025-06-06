// src/app/api/tools/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db'; // Make sure this path to your Drizzle instance is correct
import { tools } from '@/db/schema'; // Make sure this path to your tools schema is correct
import { asc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const allTools = await db.select().from(tools).orderBy(asc(tools.name));
    return NextResponse.json(allTools, { status: 200 });
  } catch (error) {
    console.error('API Error fetching tools:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tools', error: error.message },
      { status: 500 }
    );
  }
}