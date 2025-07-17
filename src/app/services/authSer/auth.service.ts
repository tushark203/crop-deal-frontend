import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private role = signal<string | null>(null);
  private userId = signal<number | null>(null);
  private email = signal<string | null>(null);

   constructor() {
    this.initializeFromToken(); 
  }

   private initializeFromToken() {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.role.set(payload.role);
        this.userId.set(payload.userId);
        this.email.set(payload.sub); // assuming 'sub' is email
      } catch (e) {
        console.error('Failed to decode JWT token', e);
        this.clear();
      }
    }
  }

  setLoginInfo({ role, userId, email }: { role: string; userId: number; email: string }) {
    this.role.set(role);
    this.userId.set(userId);
    this.email.set(email);
  }

  getLoginInfo() {
    return {
      role: this.role,
      userId: this.userId,
      email: this.email
    };
  }

  logout() {
    this.role.set(null);
    this.userId.set(null);
    this.email.set(null);
  }

  private clear() {
    this.role.set(null);
    this.userId.set(null);
    this.email.set(null);
  }
}
