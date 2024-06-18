import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpdfComponentComponent } from './listpdf-component.component';

describe('ListpdfComponentComponent', () => {
  let component: ListpdfComponentComponent;
  let fixture: ComponentFixture<ListpdfComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListpdfComponentComponent]
    });
    fixture = TestBed.createComponent(ListpdfComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
