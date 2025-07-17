import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-admin-dealer-list',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './admin-dealer-list.component.html',
  styleUrl: './admin-dealer-list.component.css'
})
export class AdminDealerListComponent implements OnInit {
  dealers: any[] = [];
  editForm!: FormGroup;
  showEditModal = false;
  selectedDealerId!: number;
  
  constructor(private adminService:AdminService,private fb: FormBuilder){}


  ngOnInit(): void {
    this.fetchDealers();
    
  }

  fetchDealers(): void {
    this.adminService.getAllDealers().subscribe({
      next: (res: any) => {
        this.dealers = res;
        console.log(this.dealers);
      },
      error: () => {
        console.error('Failed to load farmers');
      }
    });
  }

  openEditModal(dealer: any): void {
    this.selectedDealerId = dealer.dealer_id;
    this.showEditModal = true;

    this.editForm = this.fb.group({
      first_name: [dealer.first_name, Validators.required],
      last_name: [dealer.last_name, Validators.required],
      email: [dealer.email, [Validators.required, Validators.email]],
      status: [dealer.status, Validators.required]
    });
  }

  updateDealer(): void {
    if (this.editForm.invalid) return;

    const updatedData = this.editForm.value;
    this.adminService.editDealer(this.selectedDealerId, updatedData).subscribe({
      next: () => {
        this.showEditModal = false;
        this.fetchDealers(); // Refresh list
      },
      error: () => {
        console.error('Failed to update dealer');
      }
    });
  }

  deleteDealer(id: number): void {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.adminService.deleteFarmer(id).subscribe({
        next: () => {
          this.fetchDealers();
        },
        error: (err) => {
          console.log(err)
          console.error('Failed to delete dealer');
        }
      });
    }
  }

  closeModal(): void {
    this.showEditModal = false;
  }
}