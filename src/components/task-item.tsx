
"use client"

import { useState, useActionState, useEffect } from "react"
import { toast } from "sonner"
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
    if (editState.message) {
      if (editState.success) {
        toast.success(editState.message)
        setEditing(false)
      } else {
        toast.error(editState.message)
      }
    }
  }, [editState])

  useEffect(() => {
    if (statusState.message) {
      if (statusState.success) {
        toast.success(statusState.message)
      } else {
        toast.error(statusState.message)
      }
    }
  }, [statusState])

  useEffect(() => {
    if (deleteState.message) {
      if (deleteState.success) {
        toast.success(deleteState.message)
      } else {
        toast.error(deleteState.message)
      }
    }
  }, [deleteState])

  return (
    <div className="border-b py-4 space-y-3">
      {editing ? (
        <form action={editAction} className="space-y-3">
          <input type="hidden" name="id" value={task.id} />

          <Input
            name="title"
            defaultValue={task.title}
            placeholder="Título da tarefa"
            maxLength={100}
            required
          />

          <Textarea
            name="description"
            defaultValue={task.description ?? ""}
            placeholder="Descrição (opcional)"
            maxLength={500}
            rows={3}
          />

          <div className="flex gap-2">
            <Button type="submit" isDisabled={editPending}>
              {editPending ? "Salvando..." : "Salvar"}
            </Button>

            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <h3 className="font-semibold">{task.title}</h3>

            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}

            <p className="text-xs text-muted-foreground mt-1">
              Criada em: {task.createdAt.toLocaleDateString("pt-BR")}
            </p>

            <p className="text-sm mt-1">
              Status: {task.completed ? "Concluída" : "Pendente"}
            </p>
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

            <form
              action={deleteAction}
              onSubmit={(event) => {
                if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
                  event.preventDefault()
                }
              }}
            >
              <input type="hidden" name="id" value={task.id} />

              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-600"
                isDisabled={deletePending}
              >
                {deletePending ? "Excluindo..." : "Excluir"}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
