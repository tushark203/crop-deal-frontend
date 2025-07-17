import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { AdminCropListComponent } from '../../components/admin/admin-crop-list/admin-crop-list.component';
import { AdminFarmerListComponent } from '../../components/admin/admin-farmer-list/admin-farmer-list.component';
import { AdminDealerListComponent } from '../../components/admin/admin-dealer-list/admin-dealer-list.component';
import { AdminReviewsComponent } from '../../components/admin/admin-reviews/admin-reviews.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule,AdminCropListComponent,AdminFarmerListComponent,AdminDealerListComponent,AdminReviewsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  section: string = 'dashboard'; // default section

  farmerCount: number = 0;
  dealerCount: number = 0;
  cropCount: number = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  showSection(sectionName: string): void {
    this.section = sectionName;
  }

  private loadDashboardCounts(): void {
    this.adminService.getAllFarmers().subscribe({
      next: (farmers: any[]) => {this.farmerCount = farmers.length;},
      error: () => this.farmerCount = 0
    });

    this.adminService.getAllDealers().subscribe({
      next: (dealers: any[]) => this.dealerCount = dealers.length,
      error: () => this.dealerCount = 0
    });

    this.adminService.getAllCrops().subscribe({
      next: (crops: any[]) => this.cropCount = crops.length,
      error: () => this.cropCount = 0
    });
  }
}