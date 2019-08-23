import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceSystemComponent } from './add-source-system.component';

describe('AddSourceSystemComponent', () => {
  let component: AddSourceSystemComponent;
  let fixture: ComponentFixture<AddSourceSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSourceSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSourceSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
