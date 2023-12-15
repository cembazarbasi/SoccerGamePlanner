import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule  } from '@angular/common/http' // this will handle api requests from backend
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserService } from './service/user.service';
import { EventService } from './service/event.service';
import { GoogleMapsModule } from '@angular/google-maps';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoggingInterceptor } from './service/logging-interceptor';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    EventListComponent,
    EventDetailComponent,
    UserListComponent,   
    ForgotPasswordComponent, 
    ResetPasswordComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule,
    RouterModule
   
  ],
  providers: [UserService, EventService, {
    provide: HTTP_INTERCEPTORS,
    useClass: LoggingInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
