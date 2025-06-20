import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Exibe uma mensagem de sucesso
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['success-snackbar'],
      duration: 4000,
    });
  }

  /**
   * Exibe uma mensagem de erro
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['error-snackbar'],
      duration: 6000,
    });
  }

  /**
   * Exibe uma mensagem de aviso
   */
  showWarning(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['warning-snackbar'],
      duration: 5000,
    });
  }

  /**
   * Exibe uma mensagem de informação
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['info-snackbar'],
      duration: 4000,
    });
  }
} 