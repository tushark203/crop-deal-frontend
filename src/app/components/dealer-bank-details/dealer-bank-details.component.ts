import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerService } from '../../services/dealer.service';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-dealer-bank-details',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dealer-bank-details.component.html',
  styleUrl: './dealer-bank-details.component.css'
})
export class DealerBankDetailsComponent {

   dealerId :any;
  bankDetails: any = null;
  showForm = false;
  bankForm!: FormGroup;
  isEditMode = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dealerService: DealerService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe((params) => {
    //   this.dealerId = params['dealerId'];
    // });
    this.dealerId = this.authService.getLoginInfo().userId();

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
    this.dealerService.getBankDet(this.dealerId).subscribe({
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
      ? `http://localhost:8000/dealer/${this.dealerId}/update-bank-details`
      : `http://localhost:8000/dealer/${this.dealerId}/add-bank-details`;

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

      this.http.post(endpoint, this.bankForm.value,{responseType:"text"}).subscribe({
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
