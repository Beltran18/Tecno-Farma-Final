"use client"

// Inspirado en la librería react-hot-toast
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const LIMITE_NOTIFICACIONES = 1
const RETRASO_ELIMINAR_NOTIFICACION = 1000000

type NotificacionTostadora = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const tiposDeAccion = {
  AGREGAR_NOTIFICACION: "AGREGAR_NOTIFICACION",
  ACTUALIZAR_NOTIFICACION: "ACTUALIZAR_NOTIFICACION",
  DESCARTAR_NOTIFICACION: "DESCARTAR_NOTIFICACION",
  ELIMINAR_NOTIFICACION: "ELIMINAR_NOTIFICACION",
} as const

let contador = 0

function generarId() {
  contador = (contador + 1) % Number.MAX_SAFE_INTEGER
  return contador.toString()
}

type TipoDeAccion = typeof tiposDeAccion

type Accion =
  | {
      type: TipoDeAccion["AGREGAR_NOTIFICACION"]
      toast: NotificacionTostadora
    }
  | {
      type: TipoDeAccion["ACTUALIZAR_NOTIFICACION"]
      toast: Partial<NotificacionTostadora>
    }
  | {
      type: TipoDeAccion["DESCARTAR_NOTIFICACION"]
      toastId?: NotificacionTostadora["id"]
    }
  | {
      type: TipoDeAccion["ELIMINAR_NOTIFICACION"]
      toastId?: NotificacionTostadora["id"]
    }

interface Estado {
  toasts: NotificacionTostadora[]
}

const tiemposDeEsperaNotificacion = new Map<string, ReturnType<typeof setTimeout>>()

const agregarAColaDeEliminacion = (toastId: string) => {
  if (tiemposDeEsperaNotificacion.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    tiemposDeEsperaNotificacion.delete(toastId)
    despachar({
      type: "ELIMINAR_NOTIFICACION",
      toastId: toastId,
    })
  }, RETRASO_ELIMINAR_NOTIFICACION)

  tiemposDeEsperaNotificacion.set(toastId, timeout)
}

export const reductor = (estado: Estado, accion: Accion): Estado => {
  switch (accion.type) {
    case "AGREGAR_NOTIFICACION":
      return {
        ...estado,
        toasts: [accion.toast, ...estado.toasts].slice(0, LIMITE_NOTIFICACIONES),
      }

    case "ACTUALIZAR_NOTIFICACION":
      return {
        ...estado,
        toasts: estado.toasts.map((t) =>
          t.id === accion.toast.id ? { ...t, ...accion.toast } : t
        ),
      }

    case "DESCARTAR_NOTIFICACION": {
      const { toastId } = accion

      if (toastId) {
        agregarAColaDeEliminacion(toastId)
      } else {
        estado.toasts.forEach((toast) => {
          agregarAColaDeEliminacion(toast.id)
        })
      }

      return {
        ...estado,
        toasts: estado.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "ELIMINAR_NOTIFICACION":
      if (accion.toastId === undefined) {
        return {
          ...estado,
          toasts: [],
        }
      }
      return {
        ...estado,
        toasts: estado.toasts.filter((t) => t.id !== accion.toastId),
      }
  }
}

const oyentes: Array<(state: Estado) => void> = []

let estadoEnMemoria: Estado = { toasts: [] }

function despachar(accion: Accion) {
  estadoEnMemoria = reductor(estadoEnMemoria, accion)
  oyentes.forEach((oyente) => {
    oyente(estadoEnMemoria)
  })
}

type Notificacion = Omit<NotificacionTostadora, "id">

function notificacion({ ...props }: Notificacion) {
  const id = generarId()

  const actualizar = (props: NotificacionTostadora) =>
    despachar({
      type: "ACTUALIZAR_NOTIFICACION",
      toast: { ...props, id },
    })
  const descartar = () => despachar({ type: "DESCARTAR_NOTIFICACION", toastId: id })

  despachar({
    type: "AGREGAR_NOTIFICACION",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) descartar()
      },
    },
  })

  return {
    id: id,
    descartar,
    actualizar,
  }
}

function usarNotificacion() {
  const [estado, setEstado] = React.useState<Estado>(estadoEnMemoria)

  React.useEffect(() => {
    oyentes.push(setEstado)
    return () => {
      const index = oyentes.indexOf(setEstado)
      if (index > -1) {
        oyentes.splice(index, 1)
      }
    }
  }, [estado])

  return {
    ...estado,
    notificacion,
    descartar: (toastId?: string) => despachar({ type: "DESCARTAR_NOTIFICACION", toastId }),
  }
}

export { usarNotificacion, notificacion }
