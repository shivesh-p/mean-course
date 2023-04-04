import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string;
  timer: any;
  private baseUrl: string = 'http://localhost:3000/api/user';
  private authStatusListener$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatus() {
    return this.authStatusListener$.asObservable();
  }

  getToken() {
    return this.token;
  }

  signUp(user: User) {
    this.http.post(`${this.baseUrl}/signup`, user).subscribe((v) => {
      console.log(v);
    });
  }

  login(user: User) {
    this.http
      .post<{ token: string; expiresIn: number }>(`${this.baseUrl}/login`, user)
      .subscribe((v) => {
        //console.log(v);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + v.expiresIn * 1000);
        this.setAuthTimer(v.expiresIn);
        if (v.token) {
          this.token = v.token;
          this.authStatusListener$.next(true);
        }
        this.saveAuthData(this.token, expirationDate);
        this.router.navigate(['/list']);
      });
  }

  logout() {
    clearTimeout(this.timer);
    this.clearAuthData();
    this.token = null;
    this.authStatusListener$.next(false);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    //settings the auth data
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }
  private clearAuthData() {
    //clearing the auth data
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  autoAuthUser() {
    const authData = this.getAuthData();

    if (!authData) return null;

    const now = new Date();
    //const isTokenNotExpired = authData.expirationDate > now;

    //get the difference between the expiration date timestamp and the current timestamp
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      clearTimeout(this.timer);
      // expires is in milliseconds and we are passing the duration in seconds so we divide by 1000 to convert to seconds
      this.setAuthTimer(expiresIn / 1000);
      this.token = authData.token;
      this.authStatusListener$.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.timer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!(token && expirationDate)) return null;
    else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
      };
    }
  }
}
