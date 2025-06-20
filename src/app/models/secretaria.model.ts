export interface Secretaria {
  id?: string;
  nome: string;  
  sigla: string;
}

export interface CreateSecretariaRequest {
  nome: string;
  sigla: string;
}

export interface UpdateSecretariaRequest {
  nome: string;
  sigla: string;
} 