export interface CropDto {
  crop_id: number;
  farmer_id: number;
  crop_name: string;
  crop_type: string;
  quantity_in_kg: number;
  quantity_available: number;
  quantity_booked: number;
  price_per_kg: number;
  status: string;
  postedAt: string;
  imageUrl?: string;
}

// export interface CropDto {
//   crop_id:number;
//   crop_name: string;
//   price_per_kg: number;
//   postedAt: string;
//   imageUrl?: string;
// }