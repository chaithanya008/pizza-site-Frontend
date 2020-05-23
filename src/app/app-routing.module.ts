import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TrackOrderComponent } from './track-order/track-order.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'track-order', component: TrackOrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
