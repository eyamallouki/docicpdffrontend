import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPdfComponentComponent } from './patient-pdf-component.component';

describe('PatientPdfComponentComponent', () => {
  let component: PatientPdfComponentComponent;
  let fixture: ComponentFixture<PatientPdfComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientPdfComponentComponent]
    });
    fixture = TestBed.createComponent(PatientPdfComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
