import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Secretaria, CreateSecretariaRequest, UpdateSecretariaRequest } from '../../models';
import { SecretariaService, NotificationService } from '../../services';

export interface SecretariaFormDialogData {
  mode: 'create' | 'edit';
  secretaria?: Secretaria;
}

@Component({
  selector: 'app-secretaria-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="form-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
          {{ isEditMode ? 'Editar Secretaria' : 'Nova Secretaria' }}
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

      <form [formGroup]="secretariaForm" (ngSubmit)="onSubmit()" novalidate>
        <div mat-dialog-content class="form-content">
          <!-- Nome Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome da Secretaria</mat-label>
            <input 
              matInput 
              formControlName="nome"
              placeholder="Ex: Secretaria Municipal de Educação"
              [disabled]="loading">
            <mat-icon matSuffix>business</mat-icon>
            <mat-error *ngIf="secretariaForm.get('nome')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
            <mat-error *ngIf="secretariaForm.get('nome')?.hasError('minlength')">
              Nome deve ter pelo menos 2 caracteres
            </mat-error>
            <mat-error *ngIf="secretariaForm.get('nome')?.hasError('maxlength')">
              Nome deve ter no máximo 100 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Sigla Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Sigla</mat-label>
            <input 
              matInput 
              formControlName="sigla"
              placeholder="Ex: SEDUC"
              [disabled]="loading"
              style="text-transform: uppercase;">
            <mat-icon matSuffix>label</mat-icon>
            <mat-hint>A sigla será convertida automaticamente para maiúsculo</mat-hint>
            <mat-error *ngIf="secretariaForm.get('sigla')?.hasError('required')">
              Sigla é obrigatória
            </mat-error>
            <mat-error *ngIf="secretariaForm.get('sigla')?.hasError('minlength')">
              Sigla deve ter pelo menos 2 caracteres
            </mat-error>
            <mat-error *ngIf="secretariaForm.get('sigla')?.hasError('maxlength')">
              Sigla deve ter no máximo 10 caracteres
            </mat-error>
            <mat-error *ngIf="secretariaForm.get('sigla')?.hasError('pattern')">
              Sigla deve conter apenas letras e números
            </mat-error>
          </mat-form-field>
        </div>

        <div mat-dialog-actions align="end" class="form-actions">
          <button 
            type="button" 
            mat-button 
            mat-dialog-close
            [disabled]="loading">
            Cancelar
          </button>
          <button 
            type="submit" 
            mat-raised-button 
            color="primary"
            [disabled]="secretariaForm.invalid || loading">
            <mat-icon *ngIf="!loading">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-dialog {
      min-width: 400px;
      margin: 24px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: -24px -24px 16px -24px;
      padding: 16px 24px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-content {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      margin: 16px 0 0 0;
      padding: 0;
      gap: 8px;
    }

    mat-progress-bar {
      margin: -4px -24px 0 -24px;
    }

    mat-form-field {
      margin-bottom: 8px;
    }
  `]
})
export class SecretariaFormDialogComponent implements OnInit {
  secretariaForm: FormGroup;
  loading = false;

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SecretariaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SecretariaFormDialogData,
    private secretariaService: SecretariaService,
    private notification: NotificationService
  ) {
    this.secretariaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.secretaria) {
      this.secretariaForm.patchValue({
        nome: this.data.secretaria.nome,
        sigla: this.data.secretaria.sigla
      });
    }

    // Auto uppercase sigla
    this.secretariaForm.get('sigla')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const upperValue = value.toUpperCase();
        if (upperValue !== value) {
          this.secretariaForm.get('sigla')?.setValue(upperValue, { emitEvent: false });
        }
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      sigla: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Z0-9]+$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.secretariaForm.valid && !this.loading) {
      const formValue = this.secretariaForm.value;
      
      if (this.isEditMode) {
        this.updateSecretaria(formValue);
      } else {
        this.createSecretaria(formValue);
      }
    }
  }

  private createSecretaria(formValue: CreateSecretariaRequest): void {
    this.loading = true;
    
    this.secretariaService.create(formValue).subscribe({
      next: (secretaria) => {
        this.loading = false;
        this.notification.showSuccess(`Secretaria "${secretaria.nome}" criada com sucesso`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private updateSecretaria(formValue: UpdateSecretariaRequest): void {
    if (!this.data.secretaria?.id) return;
    
    this.loading = true;
    
    this.secretariaService.update(this.data.secretaria.id, formValue).subscribe({
      next: (secretaria) => {
        this.loading = false;
        this.notification.showSuccess(`Secretaria "${secretaria.nome}" atualizada com sucesso`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    if (error.validationErrors) {
      // Handle validation errors from API
      error.validationErrors.forEach((validationError: any) => {
        const control = this.secretariaForm.get(validationError.field);
        if (control) {
          control.setErrors({ serverError: validationError.message });
        }
      });
    } else {
      this.notification.showError(
        error.message || 'Erro ao salvar secretaria'
      );
    }
  }
} 