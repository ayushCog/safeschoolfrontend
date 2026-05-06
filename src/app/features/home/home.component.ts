import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  displayedText = signal('');
  fullText = 'Safe School';
  typingSpeed = 150;
  isLoggedIn = signal(false);
  currentUser = signal<any>(null);
  isTyping = signal(false);

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      if (user) {
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
        this.isTyping.set(false);
        this.displayedText.set(this.fullText);
      } else {
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
        
        if (!this.isTyping()) {
          this.startTypingEffect();
        }
      }
    });
  }

  private startTypingEffect(): void {
    this.isTyping.set(true);
    let index = 0;
    const typeWriter = () => {
      if (index < this.fullText.length && !this.isLoggedIn()) {
        this.displayedText.set(this.fullText.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, this.typingSpeed);
      } else {
        this.isTyping.set(false);
      }
    };
    typeWriter();
  }

  goToDashboard(): void {
    const user = this.currentUser();
    if (!user) return;

    const roleRoutes: { [key: string]: string } = {
      'STUDENT': '/student',
      'ROLE_STUDENT': '/student',
      'student': '/student',
      'Staff': '/staff',
      'staff': '/staff',
      'STAFF': '/staff',
      'ADMIN': '/staff',
      'ROLE_ADMIN': '/staff',
      'compliance_officer': '/compliance',
    };

    const route = roleRoutes[user.role] || '/student';
    this.router.navigate([route]);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }
}