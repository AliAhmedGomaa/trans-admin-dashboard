import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { menuItems, NavItem } from './menuItems';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit {
  isLg = false;
  private breakpointObserver = inject(BreakpointObserver);
  menuItems = menuItems;
  currentDir: any = 'ltr';
  isHandset = false;
  identity = (_: number, item: NavItem) => item?.path ?? item?.name;
  expandedGroups = new Set<string>();

  toggleGroup(item: NavItem) {
    const key = item.name;
    if (this.expandedGroups.has(key)) {
      this.expandedGroups.delete(key);
    } else {
      this.expandedGroups.add(key);
    }
  }

  isExpanded(item: NavItem): boolean {
    return this.expandedGroups.has(item.name);
  }

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // Subscribe to handset changes
    this.isHandset$.subscribe((isHandset) => {
      this.isHandset = isHandset;
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe('(max-width: 1024px)')
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  onNavItemClick(drawer: any) {
    if (this.isHandset) {
      drawer.close();
    }
  }

  onSidenavActionClick(drawer: any, action?: () => void) {
    if (this.isHandset) {
      drawer.close();
    }
  }
}
