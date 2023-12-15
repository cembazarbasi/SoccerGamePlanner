import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private rsvpCountsSubject = new BehaviorSubject<{ [eventId: number]: number }>({});
  public rsvpCounts$: Observable<{ [eventId: number]: number }> = this.rsvpCountsSubject.asObservable();

  private rsvpListSubject = new BehaviorSubject<string[]>([]);
  public rsvpList$: Observable<string[]> = this.rsvpListSubject.asObservable();
  constructor() { }


  updateRsvpList(rsvpList: string[]): void {
    this.rsvpListSubject.next(rsvpList);
  }
}
