import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralButtonComponent } from './general-button.component';

describe('AddButtonComponent', () => {
  let component: GeneralButtonComponent;
  let fixture: ComponentFixture<GeneralButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneralButtonComponent]
    });
    fixture = TestBed.createComponent(GeneralButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
