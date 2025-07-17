import { Component, Input, OnInit } from '@angular/core';
import { CropService } from '../../services/crop.service';
import { AuthService } from '../../services/authSer/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crop-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './crop-reviews.component.html',
  styleUrl: './crop-reviews.component.css',
})
export class CropReviewsComponent implements OnInit {
  @Input() cropId!: number;
  dealerId!: number;
  role!: string;
  dealerNameMap: { [dealerId: number]: string } = {};

  averageRating: number = 0;
  reviews: any[] = [];

  reviewComment: string = '';
  reviewRating: number = 0;
  reviewError: string = '';

  constructor(
    private cropService: CropService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getLoginInfo().role()!;
    this.dealerId = this.auth.getLoginInfo().userId()!;
    this.getAverageRating();
    this.getReviews();
  }

  getAverageRating() {
    this.cropService
      .getAverageRating(this.cropId)
      .subscribe((rating) => (this.averageRating = rating));
  }

  // getReviews() {
  //   this.cropService
  //     .getReviews(this.cropId)
  //     .subscribe((data) => (this.reviews = data));
  // }

  getReviews() {
  this.cropService.getReviews(this.cropId).subscribe((data) => {
    this.reviews = data;

    // Fetch dealer names once and cache them
    const uniqueDealerIds = [...new Set(data.map(r => r.dealerId))];

    uniqueDealerIds.forEach((id) => {
      if (!this.dealerNameMap[id]) {
        this.cropService.getDealerDet(id).subscribe(
          (dealer: any) => {
            this.dealerNameMap[id] = dealer.first_name + ' ' + dealer.last_name;
          },
          (err) => {
            console.error('Error fetching dealer details:', err);
            this.dealerNameMap[id] = 'Unknown Dealer';
          }
        );
      }
    });
  });
}


  submitReview() {
    if (this.role !== 'DEALER') {
      this.reviewError = '⚠️ Please login as a dealer to submit reviews.';
      return;
    }
    if (!this.reviewComment || !this.reviewRating) {
      this.reviewError = 'Please fill in comment and rating.';
      return;
    }

    const review = {
      cropId: this.cropId,
      dealerId: this.dealerId,
      comment: this.reviewComment,
      rating: this.reviewRating,
    };

    this.cropService.submitReview(this.cropId, this.dealerId, review).subscribe(
      () => {
        this.reviewComment = '';
        this.reviewRating = 0;
        this.reviewError = '';
        this.getReviews();
        this.getAverageRating();
      },
      (err) => {
        this.reviewError = '❌ Failed to submit review.';
        console.log(err);
      }
    );
  }

  getDelaerName(dealerId: number): string {
    console.log("get dealer name of that review called "+dealerId);
    let dealerName = '';
    this.cropService.getDealerDet(dealerId).subscribe(
      (data: any) => {
        dealerName = data.first_name + ' ' + data.last_name;
      },
      (err) => {
        console.error('Error fetching dealer details:', err);
      }
    );
    return dealerName;
  }
}
