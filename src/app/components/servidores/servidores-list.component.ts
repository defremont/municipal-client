import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';


import { Servidor, LoadingState } from '../../models';
import { ServidorService, NotificationService } from '../../services';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../shared/components/confirmation-dialog.component';
import { ServidorFormDialogComponent } from './servidor-form-dialog.component';

@Component({
  selector: 'app-servidores-list',
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
    MatTooltipModule,
    LoadingSpinnerComponent,
    DatePipe
  ],
  template: `
    <div class="servidores-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-toolbar color="primary">
              <mat-icon>people</mat-icon>
              <span>Gerenciamento de Servidores</span>
              <span class="spacer"></span>
              <button 
                mat-raised-button 
                color="accent" 
                (click)="openCreateDialog()"
                [disabled]="loadingState.loading">
                <mat-icon>person_add</mat-icon>
                Novo Servidor
              </button>
            </mat-toolbar>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>


          <!-- Loading State -->
          <app-loading-spinner 
            [loading]="loadingState.loading" 
            message="Carregando servidores...">
          </app-loading-spinner>

          <!-- Error State -->
          <div *ngIf="loadingState.error" class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <p>{{ loadingState.error }}</p>
            <button mat-button color="primary" (click)="loadServidores()">
              <mat-icon>refresh</mat-icon>
              Tentar Novamente
            </button>
          </div>

          <!-- Table -->
          <div class="table-container" *ngIf="!loadingState.loading && !loadingState.error">
            <table mat-table [dataSource]="dataSource" matSort class="servidores-table">
              <!-- Nome Column -->
              <ng-container matColumnDef="nome">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
                <td mat-cell *matCellDef="let servidor">{{ servidor.nome }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>E-mail</th>
                <td mat-cell *matCellDef="let servidor">
                  <a [href]="'mailto:' + servidor.email" class="email-link">
                    {{ servidor.email }}
                  </a>
                </td>
              </ng-container>

              <!-- Data Nascimento Column -->
              <ng-container matColumnDef="dataNascimento">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Data de Nascimento</th>
                <td mat-cell *matCellDef="let servidor">
                  {{ servidor.dataNascimento | date:'dd/MM/yyyy' }}
                </td>
              </ng-container>

              <!-- Secretaria Column -->
              <ng-container matColumnDef="secretaria">
                <th mat-header-cell *matHeaderCellDef>Secretaria</th>
                <td mat-cell *matCellDef="let servidor">
                  <div class="secretaria-info">
                    <span class="secretaria-nome">{{ servidor.secretaria.nome }}</span>
                    <span class="secretaria-sigla">{{ servidor.secretaria.sigla }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="actions-header">Ações</th>
                <td mat-cell *matCellDef="let servidor" class="actions-cell">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="openEditDialog(servidor)"
                    matTooltip="Editar servidor">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="confirmDelete(servidor)"
                    matTooltip="Excluir servidor">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- No Data -->
            <div *ngIf="dataSource.data.length === 0" class="no-data">
              <mat-icon>person_outline</mat-icon>
              <p>Nenhum servidor encontrado</p>
              <button mat-raised-button color="primary" (click)="openCreateDialog()">
                <mat-icon>person_add</mat-icon>
                Cadastrar Primeiro Servidor
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
    .servidores-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }



    .spacer {
      flex: 1 1 auto;
    }

    .table-container {
      margin-top: 20px;
    }

    .servidores-table {
      width: 100%;
    }

    .email-link {
      color: #1976d2;
      text-decoration: none;
    }

    .email-link:hover {
      text-decoration: underline;
    }

    .secretaria-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .secretaria-nome {
      font-size: 14px;
      font-weight: 500;
    }

    .secretaria-sigla {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 500;
      font-size: 11px;
      align-self: flex-start;
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

    /* Responsive table */
    @media (max-width: 768px) {
      .servidores-table {
        font-size: 12px;
      }
      
      .secretaria-info {
        font-size: 12px;
      }
    }
  `]
})
export class ServidoresListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'email', 'dataNascimento', 'secretaria', 'actions'];
  dataSource = new MatTableDataSource<Servidor>();
  
  loadingState: LoadingState = {
    loading: false,
    error: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servidorService: ServidorService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadServidores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadServidores(): void {
    this.loadingState = { loading: true, error: null };
    
    this.servidorService.getAll().subscribe({
      next: (servidores) => {
        this.dataSource.data = servidores;
        this.loadingState = { loading: false, error: null };
      },
      error: (error) => {
        this.loadingState = { 
          loading: false, 
          error: error.message || 'Erro ao carregar servidores' 
        };
        this.notification.showError('Erro ao carregar servidores');
      }
    });
  }



  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ServidorFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServidores();
      }
    });
  }

  openEditDialog(servidor: Servidor): void {
    const dialogRef = this.dialog.open(ServidorFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', servidor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServidores();
      }
    });
  }

  confirmDelete(servidor: Servidor): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o servidor "${servidor.nome}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && servidor.id) {
        this.deleteServidor(servidor.id, servidor.nome);
      }
    });
  }

  private deleteServidor(id: string, nome: string): void {
    this.servidorService.remove(id).subscribe({
      next: () => {
        this.notification.showSuccess(`Servidor "${nome}" excluído com sucesso`);
        this.loadServidores();
      },
      error: (error) => {
        this.notification.showError(
          error.message || 'Erro ao excluir servidor'
        );
      }
    });
  }
} 