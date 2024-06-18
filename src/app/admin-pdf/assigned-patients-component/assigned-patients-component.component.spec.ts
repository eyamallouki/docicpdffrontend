import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedPatientsComponentComponent } from './assigned-patients-component.component';

describe('AssignedPatientsComponentComponent', () => {
  let component: AssignedPatientsComponentComponent;
  let fixture: ComponentFixture<AssignedPatientsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedPatientsComponentComponent]
    });
    fixture = TestBed.createComponent(AssignedPatientsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
