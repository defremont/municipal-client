import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Secretaria, CreateSecretariaRequest, UpdateSecretariaRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SecretariaService extends BaseApiService {

  /**
   * Lista todas as secretarias
   */
  getAll(): Observable<Secretaria[]> {
    return this.get<Secretaria[]>('/secretarias');
  }

  /**
   * Busca uma secretaria por ID
   */
  getById(id: string): Observable<Secretaria> {
    return this.get<Secretaria>(`/secretarias/${id}`);
  }

  /**
   * Busca uma secretaria por sigla
   */
  getBySigla(sigla: string): Observable<Secretaria> {
    return this.get<Secretaria>(`/secretarias/sigla/${sigla}`);
  }

  /**
   * Busca secretarias por nome (busca parcial)
   */
  searchByNome(nome: string): Observable<Secretaria[]> {
    return this.get<Secretaria[]>(`/secretarias/search?nome=${encodeURIComponent(nome)}`);
  }

  /**
   * Verifica se uma secretaria existe
   */
  exists(id: string): Observable<boolean> {
    return this.get<boolean>(`/secretarias/${id}/exists`);
  }

  /**
   * Cria uma nova secretaria
   */
  create(secretaria: CreateSecretariaRequest): Observable<Secretaria> {
    return this.post<Secretaria>('/secretarias', secretaria);
  }

  /**
   * Atualiza uma secretaria existente
   */
  update(id: string, secretaria: UpdateSecretariaRequest): Observable<Secretaria> {
    return this.put<Secretaria>(`/secretarias/${id}`, secretaria);
  }

  /**
   * Remove uma secretaria
   */
  remove(id: string): Observable<void> {
    return this.delete(`/secretarias/${id}`);
  }
} 