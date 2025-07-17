import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-crop-list',
  imports: [CommonModule],
  templateUrl: './admin-crop-list.component.html',
  styleUrl: './admin-crop-list.component.css'
})
export class AdminCropListComponent implements OnInit {
  crops: any[] = [];

  constructor(private adminService:AdminService){}

  ngOnInit(): void {
    this.fetchCrops();
  }

  fetchCrops(): void {
    this.adminService.getAllCrops().subscribe({
      next: (res: any) => {
        this.crops = res;
        console.log(this.crops);
      },
      error: (err) => {
        console.log(err);
        console.error('Failed to load crops');
      }
    });
  }

  deleteCrop(cropId: number): void {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.adminService.deleteCrop(cropId).subscribe({
        next: () => {
          this.crops = this.crops.filter(crop => crop.crop_id !== cropId);
          alert('Crop deleted successfully!');
        },
        error: () => {
          alert('Failed to delete crop');
        }
      });
    }
  }

}
