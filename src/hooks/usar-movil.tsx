import * as React from "react"

const PUNTO_QUIEBRE_MOVIL = 768

export function usarEsMovil() {
  const [esMovil, setEsMovil] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${PUNTO_QUIEBRE_MOVIL - 1}px)`)
    const alCambiar = () => {
      setEsMovil(window.innerWidth < PUNTO_QUIEBRE_MOVIL)
    }
    mql.addEventListener("change", alCambiar)
    setEsMovil(window.innerWidth < PUNTO_QUIEBRE_MOVIL)
    return () => mql.removeEventListener("change", alCambiar)
  }, [])

  return !!esMovil
}
