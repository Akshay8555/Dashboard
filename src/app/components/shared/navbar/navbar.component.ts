import { Component } from '@angular/core';
import { TimezoneService } from 'src/app/services/timezone.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  timezone: string | undefined;
 constructor(private timezoneServices:TimezoneService,private auth:AuthService){}
    ngOnit():void{
      this.timezone=this.timezoneServices.getBrowserTimezone();
      
    }
    register(){
      this.auth.logout();
    }
}
