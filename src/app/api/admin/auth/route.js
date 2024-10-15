// pages/api/admin/authorize.js
import { NextResponse } from 'next/server';
import { decodeData } from './jwt/adminAuth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Extract token from request body
    const { token } = await req.json();

    // console.log('Token received:', token);

    // Check if token exists
    if (!token) {
      console.error('Token not provided');
      return NextResponse.error('Token not provided', { status: 401 });
    }

    // Decode and verify token
    const decoded = await decodeData(token);

    // console.log('Decoded token:', decoded);

    // Check if decoding was successful
    if (decoded.status === 'error') {
      console.error('Error decoding token:', decoded.error);
      return NextResponse.error(decoded.error, { status: 401 });
    }

    // Extract username and password from decoded token
    const { username, password } = decoded.decoded;

    // console.log('Decoded username:', username);
    // console.log('Decoded password:', password);

    // Find the admin by username
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    // console.log('Admin found:', admin);

    // If admin with the provided username does not exist
    if (!admin) {
      console.error('Admin not found');
      return NextResponse.error('Unauthorized user', { status: 401 });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, admin.password);

    // console.log('Password match:', passwordMatch);

    // If password does not match
    if (!passwordMatch) {
      console.error('Password does not match');
      return NextResponse.error('Unauthorized user', { status: 401 });
    }

    // If username and password are valid, return success response
    // console.log('User authorized');
    return NextResponse.json({ message: 'User authorized', decoded, status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.error('Invalid token', { status: 401 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
