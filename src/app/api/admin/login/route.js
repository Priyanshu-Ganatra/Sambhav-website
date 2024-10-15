// pages/api/admin/login.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { encodeData } from "../auth/jwt/adminAuth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    // console.log(username, password)
    // Find the admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    // If admin with the provided username does not exist
    if (!admin) {
      return NextResponse.json("Invalid credentials", { status: 401 });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, admin.password);

    // If password does not match
    if (!passwordMatch) {
      return NextResponse.json("Invalid credentials", { status: 401 });
    }

    const token = encodeData({ username, password });
    console.log({ admin, token });

    // If username and password are valid, return success response
    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error validating admin credentials:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
