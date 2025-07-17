import { Component } from '@angular/core';
import { AllCropsComponent } from "../../components/all-crops/all-crops.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [AllCropsComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  dealerImage = 'assets/dealer.png';

}
