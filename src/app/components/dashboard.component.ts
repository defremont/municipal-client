import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { SecretariasListComponent } from './secretarias/secretarias-list.component';
import { ServidoresListComponent } from './servidores/servidores-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    SecretariasListComponent,
    ServidoresListComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="main-toolbar">
        <mat-icon class="toolbar-icon">location_city</mat-icon>
        <span class="toolbar-title">Sistema Municipal de Recursos Humanos</span>
        <span class="toolbar-spacer"></span>
      </mat-toolbar>

      <!-- Content -->
      <div class="dashboard-content">
        <mat-tab-group class="main-tabs" animationDuration="300ms">
          <!-- Secretarias Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">business</mat-icon>
              Secretarias
            </ng-template>
            <div class="tab-content">
              <app-secretarias-list></app-secretarias-list>
            </div>
          </mat-tab>

          <!-- Servidores Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">people</mat-icon>
              Servidores
            </ng-template>
            <div class="tab-content">
              <app-servidores-list></app-servidores-list>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-icon {
      margin-right: 12px;
    }

    .toolbar-title {
      font-size: 18px;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      padding: 0;
    }

    .main-tabs {
      background-color: white;
      min-height: calc(100vh - 64px);
    }

    .main-tabs ::ng-deep .mat-mdc-tab-header {
      background-color: #fafafa;
      border-bottom: 1px solid #e0e0e0;
    }

    .main-tabs ::ng-deep .mat-mdc-tab {
      min-width: 160px;
    }

    .tab-icon {
      margin-right: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .tab-content {
      padding: 0;
      background-color: #f5f5f5;
      min-height: calc(100vh - 112px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .toolbar-title {
        font-size: 16px;
      }
      
      .main-tabs ::ng-deep .mat-mdc-tab {
        min-width: 120px;
      }
      
      .main-tabs ::ng-deep .mat-mdc-tab-label {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .toolbar-title {
        display: none;
      }
      
      .main-tabs ::ng-deep .mat-mdc-tab {
        min-width: 80px;
      }
      
      .tab-icon {
        margin-right: 4px;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class DashboardComponent {} 