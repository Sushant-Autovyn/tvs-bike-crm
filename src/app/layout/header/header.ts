import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  user: any = null;
  notifications: any[] = [];
  showDropdown = false;
  currentDate = '';

  ngOnInit(): void {
    this.setCurrentDate();
    this.user = this.auth.getUser();

    if (this.auth.getToken()) {
      this.auth.getProfile().subscribe({
        next: (response) => {
          this.user = response.user;
        }
      });

      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.notifications || [];
      }
    });
  }

  toggleNotifications(): void {
    this.showDropdown = !this.showDropdown;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.loadNotifications();
      }
    });
  }

  goToNotifications(): void {
    this.showDropdown = false;
    this.router.navigate(['/notifications']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private setCurrentDate(): void {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    this.currentDate = `${dayName}, ${day} ${month} ${year}`;
  }
}