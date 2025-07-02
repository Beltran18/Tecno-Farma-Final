'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, DollarSign, RefreshCw, AlertTriangle, PlusCircle, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format, isBefore, isWithinInterval, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { type Product } from '@/lib/types';

interface DashboardClientProps {
  initialProducts: Product[];
}

const LOW_STOCK_THRESHOLD = 10;
const EXPIRATION_THRESHOLD_DAYS = 30;

export function DashboardClient({ initialProducts }: DashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() =>
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );

  const lowStockAlerts = useMemo(() =>
    products.filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD),
    [products]
  );

  const expirationAlerts = useMemo(() => {
    const today = new Date();
    const thresholdDate = addDays(today, EXPIRATION_THRESHOLD_DAYS);
    return products.filter(p => isWithinInterval(p.expirationDate, { start: subDays(today, 1), end: thresholdDate }));
  }, [products]);

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    setProducts([...products, { ...product, id: `prod_${Date.now()}` }]);
    setIsFormOpen(false);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  const openNewForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  }
  
  return (
    <Tabs defaultValue="panel" className="space-y-4">
      <TabsList>
        <TabsTrigger value="panel">Panel de Inventario</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
        <TabsTrigger value="alerts">Alertas</TabsTrigger>
      </TabsList>

      <TabsContent value="panel">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rotación de Inventario</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-xs text-muted-foreground">Veces por año</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35.2%</div>
              <p className="text-xs text-muted-foreground">Promedio sobre costo</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, categoría..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={openNewForm}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registrar Producto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell>
                       <span className={isBefore(product.expirationDate, new Date()) ? 'text-destructive' : ''}>
                         {format(product.expirationDate, 'dd/MM/yyyy')}
                       </span>
                    </TableCell>
                    <TableCell>{product.lotNumber}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => openEditForm(product)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDeleteProduct(product.id)} className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="alerts">
         <div className="grid gap-6">
            <div>
               <h3 className="text-lg font-medium mb-2">Alertas de Stock Bajo</h3>
               <div className="space-y-4">
                  {lowStockAlerts.length > 0 ? (
                     lowStockAlerts.map(product => (
                       <Alert key={product.id}>
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>{product.name}</AlertTitle>
                         <AlertDescription>
                           Stock bajo: {product.quantity} unidades restantes.
                         </AlertDescription>
                       </Alert>
                     ))
                  ) : <p className="text-sm text-muted-foreground">No hay alertas de stock bajo.</p>}
               </div>
            </div>
             <div>
               <h3 className="text-lg font-medium mb-2">Alertas de Vencimiento</h3>
               <div className="space-y-4">
                  {expirationAlerts.length > 0 ? (
                     expirationAlerts.map(product => (
                       <Alert key={product.id} variant={isBefore(product.expirationDate, new Date()) ? 'destructive' : 'default'}>
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>{product.name} ({product.lotNumber})</AlertTitle>
                         <AlertDescription>
                           {isBefore(product.expirationDate, new Date()) ? 'Ha vencido el' : 'Vence el'} {format(product.expirationDate, 'PPP', { locale: es })}.
                         </AlertDescription>
                       </Alert>
                     ))
                  ) : <p className="text-sm text-muted-foreground">No hay productos próximos a vencer.</p>}
               </div>
            </div>
         </div>
      </TabsContent>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <ProductForm 
            product={editingProduct}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
          />
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

function ProductForm({ product, onAdd, onUpdate }: { product: Product | null, onAdd: (p: Omit<Product, 'id'>) => void, onUpdate: (p: Product) => void}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Analgésicos' | 'Antibióticos' | 'Vitaminas' | 'Dermatología' | 'Otros'>('Otros');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(new Date());
  const [lotNumber, setLotNumber] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setQuantity(product.quantity);
      setExpirationDate(product.expirationDate);
      setLotNumber(product.lotNumber);
    } else {
      setName('');
      setCategory('Otros');
      setPrice(0);
      setQuantity(0);
      setExpirationDate(new Date());
      setLotNumber('');
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expirationDate) return;
    const productData = { name, category, price, quantity, expirationDate, lotNumber };

    if (product) {
      onUpdate({ ...productData, id: product.id });
    } else {
      onAdd(productData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{product ? 'Editar Producto' : 'Registrar Producto'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
            <label htmlFor="name">Nombre</label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <label htmlFor="category">Categoría</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Analgésicos</option>
                <option>Antibióticos</option>
                <option>Vitaminas</option>
                <option>Dermatología</option>
                <option>Otros</option>
            </select>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="price">Precio</label>
                <Input id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required />
            </div>
            <div className="space-y-2">
                <label htmlFor="quantity">Cantidad</label>
                <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} required />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label>Fecha de Vencimiento</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expirationDate ? format(expirationDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <label htmlFor="lotNumber">Número de Lote</label>
                <Input id="lotNumber" value={lotNumber} onChange={e => setLotNumber(e.target.value)} required />
            </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">Guardar Cambios</Button>
      </DialogFooter>
    </form>
  );
}
