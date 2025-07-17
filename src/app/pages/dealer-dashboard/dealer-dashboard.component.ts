import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dealer-dashboard',
  imports: [RouterLink],
  templateUrl: './dealer-dashboard.component.html',
  styleUrl: './dealer-dashboard.component.css'
})
export class DealerDashboardComponent {

   dealerId = 0

  constructor( private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.dealerId = params['dealerId'];
      console.log(this.dealerId)
    });
  }

}
