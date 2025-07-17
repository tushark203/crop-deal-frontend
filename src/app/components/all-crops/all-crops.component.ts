import { Component, Input, OnInit } from '@angular/core';
import { CropService } from '../../services/crop.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { CropDto } from '../../models/crop.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-crops',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './all-crops.component.html',
  styleUrl: './all-crops.component.css',
})
export class AllCropsComponent implements OnInit {
  //allCrops:any[]=[];
  allCrops: CropDto[] = [];
  errorMessage: string = '';
  paginatedCrops: CropDto[] = [];
  currentPage: number = 1;
  cropsPerPage: number = 16;
  showAll: boolean = false;
  @Input() onHome: boolean = false;


  //filter
  searchTerm: string = '';
showFilterForm = false;

filter = {
  cropType: '',
  date: '',
  minPrice: 0,
  maxPrice: 0
};
originalCrops: CropDto[] = [];
//filter

  setOnHome() {
    this.onHome = false;
  }

  constructor(private cropService: CropService) {}

  ngOnInit(): void {
    this.getAllCrops();
  }

  getAllCrops() {
    this.cropService.getAllCrops().subscribe(
      (res: any) => {
         this.originalCrops = [...res];
        this.allCrops = res;
        console.log(res);
        this.updatePagination();
      },
      (err: any) => {
        // alert(err);
        this.errorMessage = err;
      }
    );
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.cropsPerPage;
    const end = start + this.cropsPerPage;
    this.paginatedCrops = this.allCrops.slice(start, end);
  }
  nextPage() {
    this.currentPage++;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.allCrops.length / this.cropsPerPage);
  }

  // Only first 8 for homepage
  get homepageCrops() {
    return this.allCrops.slice(0, 8);
  }




  //filter
  onSearch() {
  this.resetPagination();
  if (this.searchTerm.trim()) {
    this.allCrops = this.originalCrops.filter(crop =>
      crop.crop_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.allCrops = [...this.originalCrops];
  }
  this.updatePagination();
}

onFilter() {
  this.resetPagination();
  this.allCrops = this.originalCrops.filter(crop => {
    const matchType = this.filter.cropType ? crop.crop_type === this.filter.cropType : true;
    const matchDate = this.filter.date ? crop.postedAt?.startsWith(this.filter.date) : true;
    const matchMin = this.filter.minPrice ? crop.price_per_kg >= this.filter.minPrice : true;
    const matchMax = this.filter.maxPrice ? crop.price_per_kg <= this.filter.maxPrice : true;
    return matchType && matchDate && matchMin && matchMax;
  });
  this.updatePagination();
}

resetPagination() {
  this.currentPage = 1;
}

resetSearch() {
  this.searchTerm = '';
  this.getAllCrops();
}

resetFilter() {
  this.filter = {
    cropType: '',
    date: '',
    minPrice: 0,
    maxPrice: 0
  };

  this.getAllCrops();
  this.showFilterForm = false;
}
//filter
}
