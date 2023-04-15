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
  private userId: string;
  private baseUrl: string = 'http://localhost:3000/api/user';
  private authStatusListener$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatus() {
    return this.authStatusListener$.asObservable();
  }

  getToken() {
    return this.token;
  }
  getUserId() {
    if (this.userId) return this.userId;
    else return localStorage.getItem('userId');
  }

  signUp(user: User) {
    return this.http.post(`${this.baseUrl}/signup`, user).subscribe({
      next: (v) => {
        this.router.navigate(['/']);
      },
      error: (v) => {
        this.authStatusListener$.next(false);
      },
    });
  }

  login(user: User) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${this.baseUrl}/login`,
        user
      )
      .subscribe({
        next: (v) => {
          //console.log(v);
          if (v.token) {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + v.expiresIn * 1000);
            this.setAuthTimer(v.expiresIn);

            this.token = v.token;
            this.authStatusListener$.next(true);
            this.userId = v.userId;

            this.saveAuthData(this.token, expirationDate, v.userId);
            this.router.navigate(['/list']);
          }
        },
        error: (v) => {
          this.authStatusListener$.next(false);
        },
      });
  }

  logout() {
    clearTimeout(this.timer);
    this.clearAuthData();
    this.token = null;
    this.userId = null;
    this.authStatusListener$.next(false);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    //settings the auth data
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }
  private clearAuthData() {
    //clearing the auth data
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
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
    const userId = localStorage.getItem('userId');

    if (!(token && expirationDate)) return null;
    else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
      };
    }
  }
}
