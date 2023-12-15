
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

const API_URL = 'http://ec2-54-193-103-154.us-west-1.compute.amazonaws.com:8080'; 
//const API_URL = 'http://localhhost:8080';
@Injectable({
  providedIn: 'root',
})
export class EventService {  
  
  private participantsSubject = new BehaviorSubject<any[]>([]);
  participants$ = this.participantsSubject.asObservable();
  constructor(private http: HttpClient) {}

  addEvent(event: any): Observable<any> {
    return this.http.post(API_URL + "/dashboard", event);
  }

  addParticipant(eventId: number, fullName: string): Observable<any> {

    const url = `${API_URL}/addParticipant`;
    const participant = { attendee: fullName, eventId:eventId}; 
    return this.http.post(url, participant);
  }

  deleteAttendee(eventId: number, attendee: string): Observable<string> {  
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      
    });
    
    const url = `${API_URL}/deleteAttendee/${eventId}/${attendee}`;
    return this.http.delete<string>(url, {headers});
  }

  getParticipants(eventId:number): Observable<any[]> {
    
    const url = `${API_URL}/participants/getParticipantsByEventId/${eventId}`;   
    return this.http.get<any[]>(url);
  }

  
  getEvents(){
    return this.http.get(API_URL + "/events");
  }  

  

  getEventById(eventId: any) {
    return this.http.get(`${API_URL}/events/getEventById/${eventId}`);
  }
 
}
