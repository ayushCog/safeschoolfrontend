import { Component, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
