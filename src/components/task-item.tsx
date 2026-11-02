
"use client"

import { useState, useActionState, useEffect } from "react"
import { editTask, updateTaskStatus, removeTask } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialState = { success: false, message: "" }

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: Date
}

export function TaskItem({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false)
  const [editState, editAction, editPending] = useActionState(editTask, initialState)
  const [statusState, statusAction, statusPending] = useActionState(updateTaskStatus, initialState)
  const [deleteState, deleteAction, deletePending] = useActionState(removeTask, initialState)

  useEffect(() => {
    if (editState.success) setEditing(false)
  }, [editState.success])

  return (
    <div className="border-b py-4 space-y-3">
      {editing ? (
        <form action={editAction} className="space-y-3">
          <input type="hidden" name="id" value={task.id} />
          <Input name="title" defaultValue={task.title} placeholder="Título da tarefa" maxLength={100} required />
          <Textarea name="description" defaultValue={task.description ?? ""} placeholder="Descrição (opcional)" maxLength={500} rows={3} />

          <div className="flex gap-2">
            <Button type="submit" isDisabled={editPending}>
              {editPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>

          {editState.message && <p aria-live="polite" className="text-sm">{editState.message}</p>}
        </form>
      ) : (
        <>
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            <p className="text-xs text-muted-foreground mt-1">Criada em: {task.createdAt.toLocaleDateString("pt-BR")}</p>
            <p className="text-sm mt-1">Status: {task.completed ? "Concluída" : "Pendente"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(true)}>
              Editar
            </Button>

            <form action={statusAction}>
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="completed" value={String(!task.completed)} />
              <Button type="submit" isDisabled={statusPending}>
                {statusPending ? "Aguarde..." : task.completed ? "Reabrir" : "Concluir"}
              </Button>
            </form>

            <form action={deleteAction}>
              <input type="hidden" name="id" value={task.id} />
              <Button type="submit"  className="bg-red-600 text-white hover:bg-red-700"  isDisabled={deletePending}>
                {deletePending ? "Excluindo..." : "Excluir"}
              </Button>
            </form>
          </div>
        </>
      )}

      {statusState.message && <p aria-live="polite" className="text-sm">{statusState.message}</p>}
      {deleteState.message && <p aria-live="polite" className="text-sm">{deleteState.message}</p>}
    </div>
  )
}
