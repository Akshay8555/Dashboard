import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
  authService: any;
  private authStatus = new BehaviorSubject<boolean>(false);
  //constructor(private fireauth : AngularFireAuth, private router : Router) { }
  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.authStatus.next(true);
      } else {
        this.authStatus.next(false);
      }
    });
  }
  // login method
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
        localStorage.setItem('token','true');

        if(res.user?.emailVerified == true) {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['/varify-email']);
        }

    }, err => {
        alert(err.message);
        this.router.navigate(['/login']);
    })
  }

  // register method
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.sendEmailForVarification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

  // email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/varify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/profile']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}