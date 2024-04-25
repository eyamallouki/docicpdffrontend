import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmeresetpasswordComponent } from './confirmeresetpassword.component';

describe('ConfirmeresetpasswordComponent', () => {
  let component: ConfirmeresetpasswordComponent;
  let fixture: ComponentFixture<ConfirmeresetpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmeresetpasswordComponent]
    });
    fixture = TestBed.createComponent(ConfirmeresetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
