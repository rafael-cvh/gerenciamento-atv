import { auth } from "@clerk/nextjs/server"
import { SignOutButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createTask, updateTaskStatus, removeTask } from "./actions"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciador de Tarefas</h1>
          <p>Organize suas atividades.</p>
        </div>

        <SignOutButton>
          <button type="button" className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700">
            Sair da conta
          </button>
        </SignOutButton>
      </header>

      <hr className="my-5" />

      <h2 className="text-lg font-semibold">Cadastrar tarefa</h2>

      <form action={createTask} className="my-3 space-y-2">
        <input name="title" type="text" placeholder="Título da tarefa" required className="w-full border p-2" />

        <textarea name="description" placeholder="Descrição (opcional)" rows={2} className="w-full border p-2" />

        <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
          Adicionar tarefa
        </button>
      </form>

      <hr className="my-5" />

      <h2 className="text-lg font-semibold">Minhas tarefas ({tasks.length})</h2>

      {tasks.length === 0 && (
        <p className="my-3">Nenhuma tarefa cadastrada.</p>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="my-4 border-b pb-3">
          <h3 className="font-semibold">{task.title}</h3>

          {task.description && <p>{task.description}</p>}

          <p className="text-sm text-gray-500">
            {task.createdAt.toLocaleDateString("pt-BR")}
          </p>

          <p className="text-sm">
            {task.completed ? "Concluída" : "Pendente"}
          </p>

          <div className="mt-2 flex gap-2">
            <form action={updateTaskStatus}>
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="completed" value={String(!task.completed)} />

              <button type="submit" className="border px-2 py-1">
                {task.completed ? "Reabrir" : "Concluir"}
              </button>
            </form>

            <form action={removeTask}>
              <input type="hidden" name="id" value={task.id} />

              <button type="submit" className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700">
                Excluir
              </button>
            </form>
          </div>
        </div>
      ))}
    </main>
  )
}
