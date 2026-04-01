import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { nom, prenom, email, password } = await req.json()

    if (!nom || !prenom || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    const existeDeja = await prisma.user.findUnique({
      where: { email },
    })

    if (existeDeja) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    const motDePasseHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasseHash },
    })

    return NextResponse.json(
      { message: "Compte créé", userId: user.id },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}