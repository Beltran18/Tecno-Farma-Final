'use client';

import { type Producto } from "@/lib/types";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ComponenteEtiqueta({ producto }: { producto: Producto }) {
    const precioFinal = producto.descuento ? producto.precio * (1 - producto.descuento / 100) : producto.precio;

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div id="etiqueta-imprimible" className="p-6 bg-white rounded-lg shadow-lg border w-96 printable-card">
                <h2 className="text-2xl font-bold text-center mb-4">{producto.nombre}</h2>
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-semibold">{producto.descuento && producto.descuento > 0 ? "Precio Oferta:" : "Precio:"}</span>
                    <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(precioFinal)}
                    </span>
                </div>
                {producto.descuento && producto.descuento > 0 && (
                     <div className="text-right -mt-2 mb-4">
                        <span className="text-sm text-muted-foreground">Antes: </span>
                        <del className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio)}
                        </del>
                    </div>
                )}
                <div className="text-sm space-y-2 mb-6">
                    <p><span className="font-semibold">Vence:</span> {format(new Date(producto.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}</p>
                    <p><span className="font-semibold">Lote:</span> {producto.numeroLote}</p>
                </div>
                <div className="flex justify-center">
                    <svg
                        className="w-full h-16"
                        viewBox="0 0 200 50"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                        fill="currentColor"
                        d="M10 0h2v50h-2z m6 0h4v50h-4z m6 0h2v50h-2z m6 0h6v50h-6z m8 0h2v50h-2z m6 0h4v50h-4z m10 0h2v50h-2z m6 0h4v50h-4z m6 0h2v50h-2z m6 0h6v50h-6z m8 0h2v50h-2z m6 0h4v50h-4z m10 0h2v50h-2z m6 0h4v50h-4z m6 0h2v50h-2z m6 0h6v50h-6z m8 0h2v50h-2z m6 0h4v50h-4z m10 0h2v50h-2z m6 0h4v50h-4z m6 0h2v50h-2z m6 0h6v50h-6z m8 0h2v50h-2z"
                        />
                    </svg>
                </div>
                 <p className="text-xs text-center text-muted-foreground mt-1">{producto.id}</p>
            </div>
            <Button onClick={() => window.print()} className="mt-6 no-imprimir">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Etiqueta
            </Button>
        </div>
    );
}
