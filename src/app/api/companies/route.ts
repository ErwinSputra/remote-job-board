import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // 1. Pengecekan Autentikasi & Otorisasi
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Mengambil data dari request
    const {
      name,
      logoUrl,
      coverUrl,
      website,
      description,
      size,
      industry,
      location,
      linkedin,
    } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    // 3. Pembuatan Slug yang aman
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // 4. Menyimpan ke Database
    const company = await prisma.company.create({
      data: {
        name,
        slug,
        logoUrl: logoUrl || null,
        coverUrl: coverUrl || null,
        website: website || null,
        description: description || null,
        size: size || null,
        industry: industry || null,
        location: location || null,
        linkedin: linkedin || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    // 5. Mengecek secara spesifik apakah ini merupakan error dari Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Menangkap Error Duplikasi Data dari Prisma (P2002)
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "Nama perusahaan ini sudah terdaftar. Silakan gunakan nama lain.",
          },
          { status: 400 },
        );
      }
    }

    // Menangkap error tak terduga lainnya
    console.error("CREATE_COMPANY_ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat membuat perusahaan." },
      { status: 500 },
    );
  }
}
