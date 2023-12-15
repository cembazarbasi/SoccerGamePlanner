import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscribable } from 'rxjs';
import { EventService } from 'src/app/service/event.service';
import { RsvpService } from 'src/app/service/rsvp.service';

import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {

  event: any;  
  userEmail: string;
  rsvpList: string[]=[];
  responseMessage: string;
  eventList: any[];
  eventId:number;
  eventDetails: any;
  capacity:number;
  fullName: string;
  cancelMessage:string;
  
  


  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private rsvpService: RsvpService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  
    ){}

    ngOnInit(): void {

      
      // Fetch event details
      this.eventId = +this.route.snapshot.paramMap.get('id');
      this.eventService.getEventById(this.eventId).subscribe(
        (eventDetails) => {
          this.event = eventDetails; 
          
          if (!this.event) {
            console.error('Event not found');
          }
        },        
      ); 
      // Fetch the updated list from the backend
this.eventService.getParticipants(this.eventId).subscribe(
  (participants) => {
    // Handle the list of participants response
    this.rsvpList = participants.map(participant => participant.attendee);
  },
  (error) => {
    console.error('Failed to fetch participants after RSVP', error);
  }
);

      // Calling users first and last name 
      
      this.rsvpService.rsvpList$.subscribe((rsvpList) => {
        this.rsvpList = rsvpList;
        this.fullName = localStorage.getItem('fullName') || '';
      });
    }

    


    
    onRsvp() {
      const isUserAlreadyRsvped = this.rsvpList.includes(this.fullName);

      if (!isUserAlreadyRsvped) {
        // Call the backend API to add the participant
        this.eventService.addParticipant(this.eventId, this.fullName).subscribe(
          () => {
            console.log(`User ${this.fullName} added as a participant to event ${this.eventId}`);      
              // Fetch the updated list from the backend
          this.eventService.getParticipants(this.eventId).subscribe(
            (participants) => {
              // Handle the list of participants response
              this.rsvpList = participants.map(participant => participant.attendee);
            },
            (error) => {
              console.error('Failed to fetch participants after RSVP', error);
            }
          );

            this.responseMessage = '';
            this.cancelMessage = '';
          },
          (error) => {
            console.error(`Failed to add user ${this.fullName} as a participant to event ${this.eventId}`, error);
          });
      } else {
        this.responseMessage = 'You are already a participant in this event!';
      }
    }
    cancelRsvp(): void {
      console.log('Cancel RSVP initiated');
      this.eventService.deleteAttendee(this.eventId, this.fullName).subscribe(
        () => {
          console.log('Attendee deleted successfully');
          this.eventService.getParticipants(this.eventId).subscribe(
            (participants) => {
              console.log('Participants fetched successfully:', participants);
              this.rsvpList = participants.map(participant => participant.attendee);
              console.log('Updated rsvpList:', this.rsvpList);
    
              // Manually trigger change detection if necessary
              this.cdr.detectChanges();
            },
            (error) => {
              console.error('Failed to fetch participants after RSVP', error);
            }
          );
        },
        (error) => {
          console.error('Failed to cancel RSVP', error);
        }
      );
    }

    
    
    
} 

  
  