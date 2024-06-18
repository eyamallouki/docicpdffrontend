import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadfilepatientComponent } from './uploadfilepatient.component';

describe('UploadfilepatientComponent', () => {
  let component: UploadfilepatientComponent;
  let fixture: ComponentFixture<UploadfilepatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadfilepatientComponent]
    });
    fixture = TestBed.createComponent(UploadfilepatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
