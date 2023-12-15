import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';





const routes: Routes = [
  
  {path:'register', component:SignupComponent},
  {path:'login', component:LoginComponent},
  {path:'logout', component:LogoutComponent},
  {path:'dashboard', component:DashboardComponent},  
  {path:'events', component:EventListComponent },
  {path:'events/getEventById/:id', component:EventDetailComponent},
  {path:'reset-password/request', component:ForgotPasswordComponent},
  {path:'reset-password/reset', component:ResetPasswordComponent},
  {path: 'profile', component: ProfileComponent },
  {path:'', component:HomeComponent},
  { path: '**', redirectTo: '' },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
