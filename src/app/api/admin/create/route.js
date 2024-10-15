// pages/api/admin/login.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Check if an admin with the provided username already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.error('Username is already taken', { status: 400 });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the new admin with hashed password
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // If admin is created successfully, return success response
    return NextResponse.json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.error('Internal server error', { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
