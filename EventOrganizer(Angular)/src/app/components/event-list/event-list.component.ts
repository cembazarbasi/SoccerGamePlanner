import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

import { EventService } from 'src/app/service/event.service';
import { RsvpService } from 'src/app/service/rsvp.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent {






  authService: AuthService; 
  eventList:any[];
  users: any[];
  userEmail: string;
  fullName: string;
  image: 'src\assets\images\logopng.png';
  rsvpCounts: { [eventId: number]: number } = {};
  rsvpList: string[] = [];
  
  constructor (
    private eventService: EventService,
    private router:Router,
    private rsvpService: RsvpService,
    private userService: UserService
    ){}
  
   

    

ngOnInit(){
  console.log('AuthService in EventListComponent:', this.authService);

  this.fullName = localStorage.getItem('fullName') || '';
  console.log(this.fullName);
  
  this.userEmail = this.userService.userEmail;
  this.eventService.getEvents().subscribe((data:any[])=>{
    this.eventList=data;  
    
    
  }) 

  this.rsvpService.rsvpCounts$.subscribe((counts) => {
    this.rsvpCounts = counts;
  });

  this.rsvpService.rsvpList$.subscribe((list) => {
    this.rsvpList = list;
  });
}

onEventClick(eventId: number): void {
  this.router.navigate([`/events/getEventById/${eventId}`]);
}

getRSVPCount(eventId: number): number {
  
  return this.rsvpCounts[eventId] || 0;
}

logout() {
  console.log('AuthService:', this.authService); // Log the AuthService instance
  if (this.authService) {
    this.authService.logout().subscribe(
      () => {
        console.log('Logout successful');
        // Optionally, navigate to the login page or perform other actions
      },
      error => {
        console.error('Logout failed', error);
        // Handle error, e.g., display an error message
      }
    );
  } else {
    console.error('AuthService is undefined');
  }



}
}
