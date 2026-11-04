
"use client"

import { useState, useActionState, useEffect, startTransition } from "react"
import { toast } from "sonner"
import { editTask, updateTaskStatus, removeTask } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

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
    if (!editState.message) return
    if (editState.success) {
      toast.success(editState.message)
      setEditing(false)
    } else toast.error(editState.message)
  }, [editState])

  useEffect(() => {
    if (!statusState.message) return
    if (statusState.success) toast.success(statusState.message)
    else toast.error(statusState.message)
  }, [statusState])

  useEffect(() => {
    if (!deleteState.message) return
    if (deleteState.success) toast.success(deleteState.message)
    else toast.error(deleteState.message)
  }, [deleteState])

  function handleStatusChange() {
    const formData = new FormData()
    formData.set("id", task.id)
    formData.set("completed", String(!task.completed))
    startTransition(() => statusAction(formData))
  }

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
        </form>
      ) : (
        <>
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Criada em: {task.createdAt.toLocaleDateString("pt-BR")}
            </p>
            <div className="mt-2">
              Status:{" "}
              <Badge className={task.completed ? "bg-green-600 text-white hover:bg-green-600" : "bg-yellow-500 text-white hover:bg-yellow-500"}>
                {task.completed ? "Concluída" : "Pendente"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="text-black"
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>

            <div className="flex items-center gap-2">
              <Checkbox
                isSelected={task.completed}
                isDisabled={statusPending}
                onChange={handleStatusChange}
                aria-label="Marcar tarefa como concluída"
              />
              <span className="text-sm">
                {statusPending ? "Aguarde..." : task.completed ? "Concluída" : "Concluir tarefa"}
              </span>
            </div>

            <form action={deleteAction} onSubmit={(event) => {
              if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) event.preventDefault()
            }}>
              <input type="hidden" name="id" value={task.id} />
              <Button type="submit" className="bg-red-600 text-white hover:bg-red-600" isDisabled={deletePending}>
                {deletePending ? "Excluindo..." : "Excluir"}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
