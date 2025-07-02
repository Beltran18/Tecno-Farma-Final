'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, MessageCircle } from 'lucide-react';

export default function PaginaSoporte() {
  const numeroWhatsapp = '573217336430';
  const mensajeWhatsapp = 'Hola, necesito soporte con el sistema TecnoFarma.';
  const whatsappUrl = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`;

  const handleContactar = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
             <LifeBuoy className="h-8 w-8 text-primary" />
             <div>
                <CardTitle>Soporte Técnico Directo</CardTitle>
                <CardDescription>
                  ¿Necesitas ayuda? Contáctanos directamente por WhatsApp para una atención personalizada.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
                Al hacer clic en el botón, se abrirá una conversación en WhatsApp con un mensaje predefinido para agilizar tu consulta.
            </p>
            <Button size="lg" onClick={handleContactar}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar por WhatsApp
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
