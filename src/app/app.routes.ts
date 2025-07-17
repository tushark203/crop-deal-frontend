import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AllCropsComponent } from './components/all-crops/all-crops.component';
import { CropDetailsComponent } from './pages/crop-details/crop-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FarmerDashboardComponent } from './pages/farmer-dashboard/farmer-dashboard.component';
import { FarmerProfileComponent } from './components/farmer-profile/farmer-profile.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { FarmerBankDetailsComponent } from './components/farmer-bank-details/farmer-bank-details.component';
import { PublishCropComponent } from './components/publish-crop/publish-crop.component';
import { DealerDashboardComponent } from './pages/dealer-dashboard/dealer-dashboard.component';
import { DealerProfileComponent } from './components/dealer-profile/dealer-profile.component';
import { DealerBankDetailsComponent } from './components/dealer-bank-details/dealer-bank-details.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { MyPaymentsComponent } from './components/my-payments/my-payments.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'login',component:LoginComponent},
    { path: 'register/:role', component: RegisterComponent },
    { path: 'all-crops', component: AllCropsComponent },
    { path: 'crop-details/:id', component: CropDetailsComponent },
    { path: 'farmer/dashboard', component: FarmerDashboardComponent },
    { path: 'farmer/profile', component:FarmerProfileComponent},
    { path: 'farmer/my-crops', component:MyCropsComponent},
    { path: 'farmer/bank-details', component:FarmerBankDetailsComponent},
    { path: 'farmer/publish-crop', component:PublishCropComponent},
    { path: 'dealer/dashboard', component: DealerDashboardComponent },
    { path: 'dealer/profile', component:DealerProfileComponent},
    { path: 'dealer/bank-details', component:DealerBankDetailsComponent},
    { path: 'dealer/my-bookings', component:MyBookingsComponent},
    { path: 'dealer/payment-history', component:MyPaymentsComponent},
    { path: 'admin/dashboard', component:AdminDashboardComponent},
    {path:'**',component:PageNotFoundComponent}
];
