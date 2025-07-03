'use client';

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type RecetaMedica, type Producto } from '@/lib/types';
import { usarNotificacion } from '@/hooks/usar-notificacion';

interface ClienteRecetasProps {
  recetasIniciales: RecetaMedica[];
  productosInventario: Producto[];
}

export function ClienteRecetas({ recetasIniciales, productosInventario }: ClienteRecetasProps) {
  const [recetas, setRecetas] = useState<RecetaMedica[]>(recetasIniciales);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const { notificacion } = usarNotificacion();

  const handleAgregarReceta = async (recetaData: Omit<RecetaMedica, 'id' | 'estado'>) => {
    try {
      const response = await fetch('/api/recetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recetaData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la receta');
      }

      const nuevaReceta = await response.json();
      setRecetas(prev => [nuevaReceta, ...prev]);
      setFormularioAbierto(false);
      notificacion({
        title: 'Éxito',
        description: 'Receta registrada correctamente.',
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
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recetas Médicas</CardTitle>
              <CardDescription>
                Gestiona las recetas de tus pacientes.
              </CardDescription>
            </div>
            <Button onClick={() => setFormularioAbierto(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Receta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recetas.length > 0 ? (
                  recetas.map((receta) => (
                    <TableRow key={receta.id}>
                      <TableCell className="font-medium">{receta.pacienteNombre}</TableCell>
                      <TableCell>{receta.doctorNombre}</TableCell>
                      <TableCell>{format(new Date(receta.fechaPrescripcion), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{receta.medicamentos.length}</TableCell>
                      <TableCell>
                        <Badge variant={receta.estado === 'Pendiente' ? 'secondary' : 'default'}>
                          {receta.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay recetas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={formularioAbierto} onOpenChange={setFormularioAbierto}>
        <DialogContent className="sm:max-w-2xl">
          <FormularioReceta
            productos={productosInventario}
            onGuardar={handleAgregarReceta}
            onCerrar={() => setFormularioAbierto(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Componente de Formulario Interno ---

interface FormularioRecetaProps {
  productos: Producto[];
  onGuardar: (data: any) => Promise<void>;
  onCerrar: () => void;
}

function FormularioReceta({ productos, onGuardar, onCerrar }: FormularioRecetaProps) {
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [doctorNombre, setDoctorNombre] = useState('');
  const [fechaPrescripcion, setFechaPrescripcion] = useState<Date | undefined>(new Date());
  const [medicamentos, setMedicamentos] = useState([{ productoId: '', cantidadPrescrita: 1 }]);

  const agregarMedicamento = () => {
    setMedicamentos([...medicamentos, { productoId: '', cantidadPrescrita: 1 }]);
  };

  const eliminarMedicamento = (index: number) => {
    const nuevosMedicamentos = medicamentos.filter((_, i) => i !== index);
    setMedicamentos(nuevosMedicamentos);
  };

  const actualizarMedicamento = (index: number, campo: 'productoId' | 'cantidadPrescrita', valor: string | number) => {
    const nuevosMedicamentos = [...medicamentos];
    const med = nuevosMedicamentos[index];
    if(campo === 'productoId') med.productoId = valor as string;
    if(campo === 'cantidadPrescrita') med.cantidadPrescrita = Number(valor);
    setMedicamentos(nuevosMedicamentos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteNombre || !doctorNombre || !fechaPrescripcion || medicamentos.some(m => !m.productoId)) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    
    const datosReceta = {
      pacienteNombre,
      doctorNombre,
      fechaPrescripcion,
      medicamentos: medicamentos.map(m => ({
          productoId: m.productoId,
          cantidadPrescrita: m.cantidadPrescrita,
      })),
    };
    
    await onGuardar(datosReceta);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Registrar Nueva Receta</DialogTitle>
        <DialogDescription>
          Completa los detalles de la prescripción médica.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="paciente">Nombre del Paciente</label>
            <Input id="paciente" value={pacienteNombre} onChange={(e) => setPacienteNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="doctor">Nombre del Doctor</label>
            <Input id="doctor" value={doctorNombre} onChange={(e) => setDoctorNombre(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
            <label>Fecha de Prescripción</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaPrescripcion ? format(fechaPrescripcion, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={fechaPrescripcion} onSelect={setFechaPrescripcion} initialFocus />
                </PopoverContent>
            </Popover>
        </div>
        
        <div className="space-y-4">
          <label className="font-medium">Medicamentos Prescritos</label>
          {medicamentos.map((med, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <select 
                value={med.productoId} 
                onChange={(e) => actualizarMedicamento(index, 'productoId', e.target.value)} 
                className="flex-grow flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Selecciona un producto...</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidad})</option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={med.cantidadPrescrita}
                onChange={(e) => actualizarMedicamento(index, 'cantidadPrescrita', e.target.value)}
                className="w-24"
                required
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => eliminarMedicamento(index)} disabled={medicamentos.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={agregarMedicamento} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Medicamento
          </Button>
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onCerrar}>Cancelar</Button>
        </DialogClose>
        <Button type="submit">Guardar Receta</Button>
      </DialogFooter>
    </form>
  );
}
