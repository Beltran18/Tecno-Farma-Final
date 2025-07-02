'use server';
/**
 * @fileOverview A support ticket creation AI agent.
 *
 * - crearTicketSoporte - A function that handles the support ticket creation process.
 * - CrearTicketSoporteInput - The input type for the crearTicketSoporte function.
 * - CrearTicketSoporteOutput - The return type for the crearTicketSoporte function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CrearTicketSoporteInputSchema = z.object({
  nombre: z.string().describe('The name of the user requesting support.'),
  email: z.string().email().describe('The email of the user.'),
  asunto: z.string().describe('The subject of the support request.'),
  mensaje: z.string().describe('The detailed message of the support request.'),
});
export type CrearTicketSoporteInput = z.infer<typeof CrearTicketSoporteInputSchema>;

export const CrearTicketSoporteOutputSchema = z.object({
  ticketId: z.string().describe('A unique identifier for the created support ticket, in the format TICKET-XXXXXX where X are random numbers.'),
  respuestaEstimada: z.string().describe('An estimated response time for the support ticket, in Spanish (e.g., "2-4 horas hábiles", "24 horas").'),
  mensajeConfirmacion: z.string().describe('A friendly confirmation message in Spanish for the user.'),
});
export type CrearTicketSoporteOutput = z.infer<typeof CrearTicketSoporteOutputSchema>;

export async function crearTicketSoporte(input: CrearTicketSoporteInput): Promise<CrearTicketSoporteOutput> {
  return crearTicketSoporteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crearTicketSoportePrompt',
  input: {schema: CrearTicketSoporteInputSchema},
  output: {schema: CrearTicketSoporteOutputSchema},
  prompt: `Eres un agente de soporte técnico para el sistema TecnoFarma. Tu tarea es recibir una solicitud de soporte y generar una respuesta de confirmación estructurada.

  Recibiste la siguiente solicitud:
  - Nombre: {{{nombre}}}
  - Email: {{{email}}}
  - Asunto: {{{asunto}}}
  - Mensaje: {{{mensaje}}}

  Basado en esta información, por favor:
  1.  Genera un ID de ticket único con el formato TICKET-XXXXXX, donde XXXXXX es una secuencia de 6 dígitos aleatorios.
  2.  Estima un tiempo de respuesta realista (por ejemplo, "dentro de 24 horas", "2-4 horas hábiles").
  3.  Escribe un mensaje de confirmación amigable en español para el usuario, agradeciéndole por su solicitud y mencionando que el equipo de soporte se pondrá en contacto.

  Devuelve la información en el formato de salida especificado.`,
});

const crearTicketSoporteFlow = ai.defineFlow(
  {
    name: 'crearTicketSoporteFlow',
    inputSchema: CrearTicketSoporteInputSchema,
    outputSchema: CrearTicketSoporteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
