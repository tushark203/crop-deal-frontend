import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authSer/auth.service';

@Component({
  selector: 'app-farmer-dashboard',
  imports: [RouterLink],
  templateUrl: './farmer-dashboard.component.html',
  styleUrl: './farmer-dashboard.component.css'
})
export class FarmerDashboardComponent implements OnInit {

  farmerId = 0

  constructor( private route: ActivatedRoute){}

  ngOnInit(): void {
   
  }

}
