import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Servidor, CreateServidorRequest, UpdateServidorRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServidorService extends BaseApiService {

  /**
   * Lista todos os servidores
   */
  getAll(): Observable<Servidor[]> {
    return this.get<Servidor[]>('/servidores');
  }

  /**
   * Busca um servidor por ID
   */
  getById(id: string): Observable<Servidor> {
    return this.get<Servidor>(`/servidores/${id}`);
  }

  /**
   * Busca um servidor por email
   */
  getByEmail(email: string): Observable<Servidor> {
    return this.get<Servidor>(`/servidores/email/${encodeURIComponent(email)}`);
  }

  /**
   * Lista servidores por secretaria
   */
  getBySecretaria(secretariaId: string): Observable<Servidor[]> {
    return this.get<Servidor[]>(`/servidores/secretaria/${secretariaId}`);
  }

  /**
   * Conta servidores por secretaria
   */
  countBySecretaria(secretariaId: string): Observable<number> {
    return this.get<number>(`/servidores/secretaria/${secretariaId}/count`);
  }

  /**
   * Busca servidores por nome (busca parcial)
   */
  searchByNome(nome: string): Observable<Servidor[]> {
    return this.get<Servidor[]>(`/servidores/search?nome=${encodeURIComponent(nome)}`);
  }

  /**
   * Verifica se um servidor existe
   */
  exists(id: string): Observable<boolean> {
    return this.get<boolean>(`/servidores/${id}/exists`);
  }

  /**
   * Cria um novo servidor
   */
  create(servidor: CreateServidorRequest): Observable<Servidor> {
    return this.post<Servidor>('/servidores', servidor);
  }

  /**
   * Atualiza um servidor existente
   */
  update(id: string, servidor: UpdateServidorRequest): Observable<Servidor> {
    return this.put<Servidor>(`/servidores/${id}`, servidor);
  }

  /**
   * Remove um servidor
   */
  remove(id: string): Observable<void> {
    return this.delete(`/servidores/${id}`);
  }
} 