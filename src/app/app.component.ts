import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./core/nav/nav.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent],
})
export class AppComponent {
  title = 'admin-dashboard';
}
