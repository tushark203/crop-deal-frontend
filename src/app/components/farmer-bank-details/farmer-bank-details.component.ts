import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FarmerService } from '../../services/farmerSer/farmer.service';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-farmer-bank-details',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './farmer-bank-details.component.html',
  styleUrl: './farmer-bank-details.component.css',
})
export class FarmerBankDetailsComponent {
  farmerId :any;
  bankDetails: any = null;
  showForm = false;
  bankForm!: FormGroup;
  isEditMode = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private farmerService: FarmerService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe((params) => {
    //   this.farmerId = params['farmerId'];
    // });

    this.farmerId = this.authService.getLoginInfo().userId();
    this.initForm();
    this.fetchBankDetails();
  }

  initForm(): void {
    this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      upiId: [''],
      upiNumber: [''],
    });
  }

  fetchBankDetails(): void {
    this.farmerService.getBankDet(this.farmerId).subscribe({
      next: (res: any) => {
        if (res && res.bankName) {
        this.bankDetails = res;
        this.bankForm.patchValue(res);
        this.isEditMode = true;
      } else {
        this.bankDetails = null;
        this.isEditMode = false;
      }
      },
      error: () => {
        this.bankDetails = null;
        this.isEditMode = false;
      },
    });
  }

  openForm(): void {
    this.showForm = true;
     this.isEditMode = !!this.bankDetails;
  }

  cancel(): void {
    this.showForm = false;
    this.bankForm.reset();
    if (this.bankDetails) {
      this.bankForm.patchValue(this.bankDetails);
    }
  }

  submit(): void {
    if (this.bankForm.invalid) return;

    const endpoint = this.isEditMode
      ? `http://localhost:8000/farmer/${this.farmerId}/update-bank-details`
      : `http://localhost:8000/farmer/${this.farmerId}/add-bank-details`;

    if (this.isEditMode) {
      this.http.put(endpoint, this.bankForm.value,{responseType:"text"}).subscribe({
        next: () => {
          alert('Bank details updated!');
          this.showForm = false;
          this.fetchBankDetails();
        },
        error: (err) => {
          console.log(err);
          console.log(this.bankForm.value);
          alert('Failed to update/add bank details');
        },
      });
    }else{

      this.http.post(endpoint, this.bankForm.value).subscribe({
      next: () => {
        alert(
           'Bank details added!'
        );
        this.showForm = false;
        this.fetchBankDetails();
      },
      error: (err) => {
        console.log(err);
        console.log(this.bankForm.value);
        alert('Failed to update/add bank details');
      },
    });

    }

    
  }
}
