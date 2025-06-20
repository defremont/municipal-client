import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-content">
      <div class="dialog-header">
        <mat-icon [class]="iconClass">{{ icon }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-raised-button 
          [color]="buttonColor" 
          (click)="onConfirm()"
          cdkFocusInitial>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-content {
      min-width: 300px;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .dialog-header mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .dialog-header h2 {
      margin: 0;
    }
    
    .icon-warning {
      color: #ff9800;
    }
    
    .icon-danger {
      color: #f44336;
    }
    
    .icon-info {
      color: #2196f3;
    }
    
    [mat-dialog-content] {
      margin: 0;
      padding: 0 0 16px 0;
    }
    
    [mat-dialog-actions] {
      margin: 0;
      padding: 0;
      gap: 8px;
    }
  `]
})
export class ConfirmationDialogComponent {

  get icon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'delete_forever';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  get iconClass(): string {
    return `icon-${this.data.type || 'info'}`;
  }

  get buttonColor(): 'primary' | 'accent' | 'warn' {
    return this.data.type === 'danger' ? 'warn' : 'primary';
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 