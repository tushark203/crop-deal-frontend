
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-farmer-list',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './admin-farmer-list.component.html',
  styleUrl: './admin-farmer-list.component.css'
})
export class AdminFarmerListComponent implements OnInit {
  farmers: any[] = [];
  editForm!: FormGroup;
  showEditModal = false;
  selectedFarmerId!: number;
  
  constructor(private adminService:AdminService,private fb: FormBuilder){}


  ngOnInit(): void {
    this.fetchFarmers();
    
  }

  fetchFarmers(): void {
    this.adminService.getAllFarmers().subscribe({
      next: (res: any) => {
        this.farmers = res;
        console.log(this.farmers);
      },
      error: () => {
        console.error('Failed to load farmers');
      }
    });
  }

  openEditModal(farmer: any): void {
    this.selectedFarmerId = farmer.farmer_id;
    this.showEditModal = true;

    this.editForm = this.fb.group({
      first_name: [farmer.first_name, Validators.required],
      last_name: [farmer.last_name, Validators.required],
      email: [farmer.email, [Validators.required, Validators.email]],
      status: [farmer.status, Validators.required]
    });
  }

  updateFarmer(): void {
    if (this.editForm.invalid) return;

    const updatedData = this.editForm.value;
    this.adminService.editFarmer(this.selectedFarmerId, updatedData).subscribe({
      next: () => {
        this.showEditModal = false;
        this.fetchFarmers(); // Refresh list
      },
      error: (err) => {
        console.log(err)
        console.error('Failed to update farmer');
      }
    });
  }

  deleteFarmer(id: number): void {
    if (confirm('Are you sure you want to delete this farmer?')) {
      this.adminService.deleteFarmer(id).subscribe({
        next: () => {
          this.fetchFarmers();
        },
        error: (err) => {
          console.log(err)
          console.error('Failed to delete farmer');
        }
      });
    }
  }

  closeModal(): void {
    this.showEditModal = false;
  }
}