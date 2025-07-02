'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { type Categoria } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteCategoriasProps {
  categoriasIniciales: Categoria[];
}

export function ClienteCategorias({ categoriasIniciales }: ClienteCategoriasProps) {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciales);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const { notificacion } = usarNotificacion();

  const handleAgregarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;

    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevaCategoria }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la categoría');
      }
      const categoriaAgregada = await response.json();
      setCategorias([...categorias, categoriaAgregada]);
      setNuevaCategoria('');
      notificacion({
        title: 'Éxito',
        description: 'Categoría agregada correctamente.',
      });
    } catch (error: any) {
      notificacion({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    try {
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar la categoría');
        }
        setCategorias(categorias.filter(c => c.id !== id));
        notificacion({
            title: 'Éxito',
            description: 'Categoría eliminada correctamente.',
        });
    } catch (error: any) {
        notificacion({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Categorías</CardTitle>
        <CardDescription>
          Agrega o elimina las categorías de productos de tu inventario.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAgregarCategoria} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Nombre de la nueva categoría"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">{categoria.nombre}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.
                                Los productos existentes en esta categoría no se verán afectados, pero deberás asignarles una nueva categoría manualmente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleEliminarCategoria(categoria.id)}>
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No hay categorías registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
