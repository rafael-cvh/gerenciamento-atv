
import { auth } from "@clerk/nextjs/server"
import { SignOutButton } from "@clerk/nextjs"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { TaskForm } from "@/components/task-form"
import { TaskItem } from "@/components/task-item"
import Link from "next/link"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
        <h1 className="text-3xl font-bold">Gerenciador de Tarefas</h1>
        <p className="text-muted-foreground">Organize suas atividades de forma simples. </p>

        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90" >
            Entrar
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-black shadow-sm hover:bg-accent" >
            Cadastrar
          </Link>
        </div>
      </main>
    )
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Gerenciador de Tarefas</h1>
      <p>Organize suas atividades.</p>

      <div className="my-4">
        <SignOutButton>
          <Button className="bg-red-400 text-white hover:bg-red-700">
            Sair da conta
          </Button>
        </SignOutButton>
      </div>

      <hr className="my-5" />
      <TaskForm />

      <hr className="my-5" />
      <h2 className="text-lg font-semibold">  Minhas tarefas ({tasks.length})</h2>

      {tasks.length === 0 && ( 
        <p className="my-3">Nenhuma tarefa cadastrada.</p>
      )}

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </main>
  )
}
