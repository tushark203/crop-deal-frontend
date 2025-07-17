import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmerService } from '../../services/farmerSer/farmer.service';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-publish-crop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publish-crop.component.html',
  styleUrl: './publish-crop.component.css'
})
export class PublishCropComponent implements OnInit {

  publishForm!: FormGroup;
  farmerId:any;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private farmerService:FarmerService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.farmerId = this.authService.getLoginInfo().userId();
    this.initForm();
  }

  initForm(): void {
    this.publishForm = this.fb.group({
      crop_name: ['', Validators.required],
      crop_type: ['', Validators.required],
      quantity_in_kg: ['', [Validators.required, Validators.min(1)]],
      price_per_kg: ['', [Validators.required, Validators.min(1)]]
    });
  }

  publish(): void {
    this.submitted = true;
    if (this.publishForm.invalid) return;

    const cropData = this.publishForm.value;
    this.farmerService.publishCrop(this.farmerId,cropData)
      .subscribe({
        next: () => {
          this.successMessage = '✅ Crop published successfully!';
          this.errorMessage = '';
          this.publishForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          console.log(err)
          this.successMessage = '';
          this.errorMessage = '❌ Failed to publish crop. Please try again.';
        }
      });
  }
}

