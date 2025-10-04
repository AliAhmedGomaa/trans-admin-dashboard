import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDropdownComponent } from './general-dropdown.component';

describe('GeneralDropdownComponent', () => {
  let component: GeneralDropdownComponent;
  let fixture: ComponentFixture<GeneralDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
