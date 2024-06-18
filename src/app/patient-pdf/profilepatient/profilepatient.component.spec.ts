import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilepatientComponent } from './profilepatient.component';

describe('ProfilepatientComponent', () => {
  let component: ProfilepatientComponent;
  let fixture: ComponentFixture<ProfilepatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilepatientComponent]
    });
    fixture = TestBed.createComponent(ProfilepatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
