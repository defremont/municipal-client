import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';


import { Secretaria, LoadingState } from '../../models';
import { SecretariaService, NotificationService } from '../../services';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../shared/components/confirmation-dialog.component';
import { SecretariaFormDialogComponent } from './secretaria-form-dialog.component';

@Component({
  selector: 'app-secretarias-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="secretarias-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-toolbar color="primary">
              <mat-icon>business</mat-icon>
              <span>Gerenciamento de Secretarias</span>
              <span class="spacer"></span>
              <button 
                mat-raised-button 
                color="accent" 
                (click)="openCreateDialog()"
                [disabled]="loadingState.loading">
                <mat-icon>add</mat-icon>
                Nova Secretaria
              </button>
            </mat-toolbar>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>


          <!-- Loading State -->
          <app-loading-spinner 
            [loading]="loadingState.loading" 
            message="Carregando secretarias...">
          </app-loading-spinner>

          <!-- Error State -->
          <div *ngIf="loadingState.error" class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <p>{{ loadingState.error }}</p>
            <button mat-button color="primary" (click)="loadSecretarias()">
              <mat-icon>refresh</mat-icon>
              Tentar Novamente
            </button>
          </div>

          <!-- Table -->
          <div class="table-container" *ngIf="!loadingState.loading && !loadingState.error">
            <table mat-table [dataSource]="dataSource" matSort class="secretarias-table">
              <!-- Nome Column -->
              <ng-container matColumnDef="nome">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
                <td mat-cell *matCellDef="let secretaria">{{ secretaria.nome }}</td>
              </ng-container>

              <!-- Sigla Column -->
              <ng-container matColumnDef="sigla">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Sigla</th>
                <td mat-cell *matCellDef="let secretaria">
                  <span class="sigla-badge">{{ secretaria.sigla }}</span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="actions-header">Ações</th>
                <td mat-cell *matCellDef="let secretaria" class="actions-cell">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="openEditDialog(secretaria)"
                    matTooltip="Editar secretaria">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="confirmDelete(secretaria)"
                    matTooltip="Excluir secretaria">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Data -->
            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon>business_center</mat-icon>
              <p>Nenhuma secretaria encontrada</p>
              <button mat-raised-button color="primary" (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                Cadastrar Primeira Secretaria
              </button>
            </div>

            <!-- Paginator -->
            <mat-paginator 
              *ngIf="dataSource.data.length > 0"
              [pageSizeOptions]="[5, 10, 25, 100]"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .secretarias-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }



    .spacer {
      flex: 1 1 auto;
    }

    .table-container {
      margin-top: 20px;
    }

    .secretarias-table {
      width: 100%;
    }

    .sigla-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 12px;
    }

    .actions-header {
      text-align: center;
      width: 120px;
    }

    .actions-cell {
      text-align: center;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      color: #666;
    }

    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    mat-card-header {
      margin-bottom: 0;
    }

    mat-toolbar {
      border-radius: 4px 4px 0 0;
    }
  `]
})
export class SecretariasListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'sigla', 'actions'];
  dataSource = new MatTableDataSource<Secretaria>();
  
  loadingState: LoadingState = {
    loading: false,
    error: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private secretariaService: SecretariaService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSecretarias();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSecretarias(): void {
    this.loadingState = { loading: true, error: null };
    
    this.secretariaService.getAll().subscribe({
      next: (secretarias) => {
        this.dataSource.data = secretarias;
        this.loadingState = { loading: false, error: null };
      },
      error: (error) => {
        this.loadingState = { 
          loading: false, 
          error: error.message || 'Erro ao carregar secretarias' 
        };
        this.notification.showError('Erro ao carregar secretarias');
      }
    });
  }



  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SecretariaFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSecretarias();
      }
    });
  }

  openEditDialog(secretaria: Secretaria): void {
    const dialogRef = this.dialog.open(SecretariaFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', secretaria }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSecretarias();
      }
    });
  }

  confirmDelete(secretaria: Secretaria): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a secretaria "${secretaria.nome}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && secretaria.id) {
        this.deleteSecretaria(secretaria.id, secretaria.nome);
      }
    });
  }

  private deleteSecretaria(id: string, nome: string): void {
    this.secretariaService.remove(id).subscribe({
      next: () => {
        this.notification.showSuccess(`Secretaria "${nome}" excluída com sucesso`);
        this.loadSecretarias();
      },
      error: (error) => {
        this.notification.showError(
          error.message || 'Erro ao excluir secretaria'
        );
      }
    });
  }
} 