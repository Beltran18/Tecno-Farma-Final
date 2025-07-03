import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaInicioSesion from '@/app/page';

// Mock del hook de autenticación
jest.mock('@/context/auth-provider', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
    user: null,
  }),
}));

// Mock del hook de notificaciones
jest.mock('@/hooks/usar-notificacion', () => ({
  usarNotificacion: () => ({
    notificacion: jest.fn(),
  }),
}));

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('Página de Inicio de Sesión (Frontend)', () => {
  it('debe renderizar todos los elementos del formulario', () => {
    render(<PaginaInicioSesion />);

    // Verificar el título y la descripción
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText('Bienvenido de nuevo a TecnoFarma.')).toBeInTheDocument();

    // Verificar campos de entrada
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();

    // Verificar botón de envío
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();

    // Verificar enlaces
    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate' })).toBeInTheDocument();
  });
});
