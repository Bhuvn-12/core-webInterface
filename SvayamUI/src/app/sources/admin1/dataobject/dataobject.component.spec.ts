import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataobjectComponent } from './dataobject.component';

describe('DataobjectComponent', () => {
  let component: DataobjectComponent;
  let fixture: ComponentFixture<DataobjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataobjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataobjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
