
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTask(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Usuário não autenticado.")
  }

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()

  if (!title) {
    return
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      userId,
    },
  })

  revalidatePath("/")
}

export async function updateTaskStatus(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Usuário não autenticado.")
  }

  const id = String(formData.get("id") || "")
  const completed = formData.get("completed") === "true"

  if (!id) {
    return
  }

  await prisma.task.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      completed,
    },
  })

  revalidatePath("/")
}

export async function removeTask(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Usuário não autenticado.")
  }

  const id = String(formData.get("id") || "")

  if (!id) {
    return
  }

  await prisma.task.deleteMany({
    where: {
      id,
      userId,
    },
  })

  revalidatePath("/")
}
