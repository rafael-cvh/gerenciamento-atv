
"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type TaskActionState = {
  success: boolean
  message: string
}

export async function createTask(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, message: "Faça login para cadastrar tarefas." }
  }

  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!title) {
    return { success: false, message: "O título é obrigatório." }
  }

  if (title.length > 100 || description.length > 500) {
    return { success: false, message: "O título deve ter até 100 caracteres e a descrição até 500." }
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      userId,
    },
  })

  revalidatePath("/")

  return { success: true, message: "Tarefa cadastrada com sucesso!" }
}

export async function editTask(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, message: "Faça login para editar tarefas." }
  }

  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!id || !title) {
    return { success: false, message: "Informe o título da tarefa." }
  }

  if (title.length > 100 || description.length > 500) {
    return { success: false, message: "O título deve ter até 100 caracteres e a descrição até 500." }
  }

  const result = await prisma.task.updateMany({
    where: { id, userId },
    data: {
      title,
      description: description || null,
    },
  })

  if (result.count === 0) {
    return { success: false, message: "Tarefa não encontrada." }
  }

  revalidatePath("/")

  return { success: true, message: "Tarefa atualizada com sucesso!" }
}

export async function updateTaskStatus(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, message: "Faça login para alterar tarefas." }
  }

  const id = String(formData.get("id") ?? "")
  const completedValue = String(formData.get("completed") ?? "")

  if (!id || !["true", "false"].includes(completedValue)) {
    return { success: false, message: "Dados inválidos." }
  }

  const result = await prisma.task.updateMany({
    where: { id, userId },
    data: { completed: completedValue === "true" },
  })

  if (result.count === 0) {
    return { success: false, message: "Tarefa não encontrada." }
  }

  revalidatePath("/")

  return {
    success: true,
    message: completedValue === "true"
      ? "Tarefa concluída!"
      : "Tarefa reaberta!",
  }
}

export async function removeTask(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, message: "Faça login para excluir tarefas." }
  }

  const id = String(formData.get("id") ?? "")

  if (!id) {
    return { success: false, message: "Identificador inválido." }
  }

  const result = await prisma.task.deleteMany({
    where: { id, userId },
  })

  if (result.count === 0) {
    return { success: false, message: "Tarefa não encontrada." }
  }

  revalidatePath("/")

  return { success: true, message: "Tarefa excluída com sucesso!" }
}
