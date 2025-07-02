import { type NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { createProduct } from '@/services/product-service';
import { getAllProveedores } from '@/services/proveedor-service';
import { type Producto, TipoMovimiento } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No se encontró el archivo' }, { status: 400 });
    }

    if (file.type !== 'text/csv') {
        return NextResponse.json({ message: 'El archivo debe ser de tipo CSV' }, { status: 400 });
    }

    const fileContent = await file.text();

    const records: any[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const proveedores = await getAllProveedores();
    const proveedorMap = new Map(proveedores.map(p => [p.nombre.toLowerCase(), p.id]));
    
    const productosImportados: Producto[] = [];

    for (const record of records) {
      if (!record.nombre || !record.categoria || !record.precio || !record.cantidad || !record.fechaVencimiento || !record.numeroLote) {
        console.warn('Registro CSV omitido por falta de datos:', record);
        continue;
      }
      
      const proveedorNombre = record.proveedorNombre || null;
      const proveedorId = proveedorNombre ? proveedorMap.get(proveedorNombre.toLowerCase()) : undefined;

      const nuevoProductoData: Omit<Producto, 'id'> = {
        nombre: record.nombre,
        categoria: record.categoria,
        precio: parseFloat(record.precio),
        cantidad: parseInt(record.cantidad, 10),
        fechaVencimiento: new Date(record.fechaVencimiento),
        numeroLote: record.numeroLote,
        proveedorId: proveedorId,
        proveedorNombre: proveedorNombre,
      };

      if (isNaN(nuevoProductoData.precio) || isNaN(nuevoProductoData.cantidad) || isNaN(nuevoProductoData.fechaVencimiento.getTime())) {
          console.warn('Registro CSV omitido por datos inválidos:', record);
          continue;
      }

      const productoCreado = await createProduct(nuevoProductoData, TipoMovimiento.IMPORTACION_CSV);
      productosImportados.push(productoCreado);
    }

    return NextResponse.json({ 
        message: `${productosImportados.length} de ${records.length} productos importados exitosamente.`,
        productosImportados
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error en la importación de CSV:', error);
    return NextResponse.json({ message: 'Error interno del servidor al procesar el archivo.', error: error.message }, { status: 500 });
  }
}
