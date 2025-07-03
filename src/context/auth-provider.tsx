// src/context/auth-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Empleado, RolEmpleado } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { usarNotificacion } from '@/hooks/usar-notificacion';

type AuthContextType = {
  user: Omit<Empleado, 'password'> | null;
  isLoading: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  register: (nombre: string, email: string, contrasena: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<Empleado, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { notificacion } = usarNotificacion();

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    setUser(data);
    notificacion({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
    router.push('/panel');
  };

  const register = async (nombre: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: RolEmpleado.EMPLEADO }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error durante el registro');
    }
    setUser(data);
    notificacion({ title: '¡Registro exitoso!', description: 'Tu cuenta ha sido creada.' });
    router.push('/panel');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    notificacion({ title: 'Sesión cerrada', description: 'Vuelve pronto.' });
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
