import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor() { }

  getBrowserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
}
