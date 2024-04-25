import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPdfComponentComponent } from './admin-pdf-component.component';

describe('AdminPdfComponentComponent', () => {
  let component: AdminPdfComponentComponent;
  let fixture: ComponentFixture<AdminPdfComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPdfComponentComponent]
    });
    fixture = TestBed.createComponent(AdminPdfComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
