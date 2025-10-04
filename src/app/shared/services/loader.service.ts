import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  show() {
    this.ngZone.run(() => this.isLoadingSubject.next(true));
  }

  hide() {
    this.ngZone.run(() => this.isLoadingSubject.next(false));
  }
}
