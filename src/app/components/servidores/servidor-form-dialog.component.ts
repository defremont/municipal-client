import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { forkJoin } from 'rxjs';

import { Servidor, Secretaria, CreateServidorRequest, UpdateServidorRequest } from '../../models';
import { ServidorService, SecretariaService, NotificationService } from '../../services';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

export interface ServidorFormDialogData {
  mode: 'create' | 'edit';
  servidor?: Servidor;
}

@Component({
  selector: 'app-servidor-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatDatepickerModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="form-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
          {{ isEditMode ? 'Editar Servidor' : 'Novo Servidor' }}
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

      <!-- Loading Secretarias -->
      <app-loading-spinner 
        *ngIf="loadingSecretarias" 
        [loading]="loadingSecretarias" 
        message="Carregando secretarias...">
      </app-loading-spinner>

      <form [formGroup]="servidorForm" (ngSubmit)="onSubmit()" novalidate *ngIf="!loadingSecretarias">
        <div mat-dialog-content class="form-content">
          <!-- Nome Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome Completo</mat-label>
            <input 
              matInput 
              formControlName="nome"
              placeholder="Ex: João Silva Santos"
              [disabled]="loading">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="servidorForm.get('nome')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
            <mat-error *ngIf="servidorForm.get('nome')?.hasError('minlength')">
              Nome deve ter pelo menos 2 caracteres
            </mat-error>
            <mat-error *ngIf="servidorForm.get('nome')?.hasError('maxlength')">
              Nome deve ter no máximo 100 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Email Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>E-mail</mat-label>
            <input 
              matInput 
              formControlName="email"
              type="email"
              placeholder="Ex: joao.silva@prefeitura.gov.br"
              [disabled]="loading">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="servidorForm.get('email')?.hasError('required')">
              E-mail é obrigatório
            </mat-error>
            <mat-error *ngIf="servidorForm.get('email')?.hasError('email')">
              E-mail deve ter um formato válido
            </mat-error>
          </mat-form-field>

          <!-- Data Nascimento Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Data de Nascimento</mat-label>
            <input 
              matInput 
              [matDatepicker]="picker"
              formControlName="dataNascimento"
              placeholder="dd/mm/aaaa"
              [disabled]="loading"
              readonly>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="servidorForm.get('dataNascimento')?.hasError('required')">
              Data de nascimento é obrigatória
            </mat-error>
            <mat-error *ngIf="servidorForm.get('dataNascimento')?.hasError('matDatepickerParse')">
              Data inválida
            </mat-error>
            <mat-error *ngIf="servidorForm.get('dataNascimento')?.hasError('futureDate')">
              Data de nascimento não pode ser no futuro
            </mat-error>
            <mat-error *ngIf="servidorForm.get('dataNascimento')?.hasError('invalidAge')">
              Idade deve estar entre 18 e 75 anos
            </mat-error>
          </mat-form-field>

          <!-- Secretaria Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Secretaria</mat-label>
            <mat-select formControlName="secretariaId" [disabled]="loading">
              <mat-option *ngFor="let secretaria of secretarias" [value]="secretaria.id">
                {{ secretaria.nome }} ({{ secretaria.sigla }})
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>business</mat-icon>
            <mat-error *ngIf="servidorForm.get('secretariaId')?.hasError('required')">
              Secretaria é obrigatória
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
            [disabled]="servidorForm.invalid || loading">
            <mat-icon *ngIf="!loading">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
            {{ isEditMode ? 'Atualizar' : 'Criar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-dialog {
      min-width: 500px;
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
export class ServidorFormDialogComponent implements OnInit {
  servidorForm: FormGroup;
  secretarias: Secretaria[] = [];
  loading = false;
  loadingSecretarias = false;

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServidorFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServidorFormDialogData,
    private servidorService: ServidorService,
    private secretariaService: SecretariaService,
    private notification: NotificationService
  ) {
    this.servidorForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadSecretarias();
  }

  private loadSecretarias(): void {
    this.loadingSecretarias = true;

    this.secretariaService.getAll().subscribe({
      next: (secretarias) => {
        this.secretarias = secretarias;
        this.loadingSecretarias = false;
        
        // After loading secretarias, populate form if editing
        if (this.isEditMode && this.data.servidor) {
          this.populateEditForm();
        }
      },
      error: (error) => {
        this.loadingSecretarias = false;
        this.notification.showError('Erro ao carregar secretarias');
        this.dialogRef.close(false);
      }
    });
  }

  private populateEditForm(): void {
    if (!this.data.servidor) return;

    const servidor = this.data.servidor;
    this.servidorForm.patchValue({
      nome: servidor.nome,
      email: servidor.email,
      dataNascimento: new Date(servidor.dataNascimento),
      secretariaId: servidor.secretaria.id
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      dataNascimento: ['', [
        Validators.required,
        this.dateValidator.bind(this)
      ]],
      secretariaId: ['', Validators.required]
    });
  }

  private dateValidator(control: any) {
    if (!control.value) return null;

    const date = new Date(control.value);
    const now = new Date();

    // Check if date is in the future
    if (date > now) {
      return { futureDate: true };
    }

    // Check age (between 18 and 75 years)
    const age = this.calculateAge(date);
    if (age < 18 || age > 75) {
      return { invalidAge: true };
    }

    return null;
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  onSubmit(): void {
    if (this.servidorForm.valid && !this.loading) {
      const formValue = this.servidorForm.value;
      const requestData = this.buildRequestData(formValue);
      
      if (this.isEditMode) {
        this.updateServidor(requestData);
      } else {
        this.createServidor(requestData);
      }
    }
  }

  private buildRequestData(formValue: any): CreateServidorRequest | UpdateServidorRequest {
    return {
      nome: formValue.nome,
      email: formValue.email,
      dataNascimento: this.formatDate(formValue.dataNascimento),
      secretaria: {
        id: formValue.secretariaId
      }
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private createServidor(requestData: CreateServidorRequest): void {
    this.loading = true;
    
    this.servidorService.create(requestData).subscribe({
      next: (servidor) => {
        this.loading = false;
        this.notification.showSuccess(`Servidor "${servidor.nome}" criado com sucesso`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private updateServidor(requestData: UpdateServidorRequest): void {
    if (!this.data.servidor?.id) return;
    
    this.loading = true;
    
    this.servidorService.update(this.data.servidor.id, requestData).subscribe({
      next: (servidor) => {
        this.loading = false;
        this.notification.showSuccess(`Servidor "${servidor.nome}" atualizado com sucesso`);
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
        const control = this.servidorForm.get(validationError.field);
        if (control) {
          control.setErrors({ serverError: validationError.message });
        }
      });
    } else {
      this.notification.showError(
        error.message || 'Erro ao salvar servidor'
      );
    }
  }
} 