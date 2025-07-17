import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CropDto } from '../../models/crop.model';
import { CropService } from '../../services/crop.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FarmerService } from '../../services/farmerSer/farmer.service';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-my-crops',
  imports: [DatePipe,CommonModule,FormsModule],
  templateUrl: './my-crops.component.html',
  styleUrl: './my-crops.component.css'
})
export class MyCropsComponent {
  farmerId:any

  // myCrops:any[] = [
  //   {
  //     crop_id: 1,
  // farmer_id: 17,
  // crop_name: "mango",
  // crop_type: "Fruite",
  // quantity_in_kg: 10,
  // quantity_available: 10,
  // quantity_booked: 10,
  // price_per_kg: 10,
  // status: "Available",
  //   }
  // ]

  myCrops: CropDto[] = [];
  editingCrop: CropDto | null = null;

  constructor(private route: ActivatedRoute,private cropService: CropService,private farnerService:FarmerService,private authService:AuthService) {}

  ngOnInit(): void {
   this.farmerId = this.authService.getLoginInfo().userId();

    this.loadMyCrops();
  }

  loadMyCrops(): void {
    this.farnerService.getFarmersCrop(this.farmerId).subscribe((data:any)=>{
        this.myCrops = data;
    })
  }

  openEditForm(crop: CropDto): void {
    // Make a deep copy to avoid changing original data
    this.editingCrop = { ...crop };
  }

  cancelEdit(): void {
    this.editingCrop = null;
  }

  confirmUpdate(): void {
    if (!this.editingCrop) return;

    this.cropService.editCropById(this.farmerId,this.editingCrop.crop_id,this.editingCrop,).subscribe({
      next: () => {
        alert('Crop updated successfully');
        this.editingCrop = null;
        this.loadMyCrops();
      },
      error: (err) =>{ console.log(err) 
        alert('Update failed')}
    });
  }

  deleteCrop(cropId: number) {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.cropService.deleteCropById(this.farmerId, cropId).subscribe({
        next: () => {
          alert('Crop deleted successfully!');
          this.loadMyCrops();
        },
        error: () => alert('Failed to delete crop.')
      });
    }
  }

}
