import { Secretaria } from './secretaria.model';

export interface Servidor {
  id?: string;
  nome: string;
  email: string;
  dataNascimento: string; // ISO date string
  secretaria: Secretaria;
}

export interface CreateServidorRequest {
  nome: string;
  email: string;
  dataNascimento: string; // ISO date string  
  secretaria: {
    id: string;
  };
}

export interface UpdateServidorRequest {
  nome: string;
  email: string;
  dataNascimento: string; // ISO date string
  secretaria: {
    id: string;
  };
} 