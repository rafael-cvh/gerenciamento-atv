"use client"

import { useActionState } from "react"
import { createTask } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
  success: false,
  message: "",
}

export function TaskForm() {
  const [state, formAction, isPending] = useActionState(createTask, initialState)

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Cadastrar tarefa</h2>

      <form action={formAction} className="space-y-3">
        <Input
          name="title"
          placeholder="Título da tarefa"
          maxLength={100}
          required
        />

        <Textarea
          name="description"
          placeholder="Descrição (opcional)"
          maxLength={500}
          rows={3}
        />

        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Cadastrando..." : "Adicionar tarefa"}
        </Button>

        {state.message && (
          <p
            aria-live="polite"
            className={state.success ? "text-sm text-green-600" : "text-sm text-red-600"}
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}