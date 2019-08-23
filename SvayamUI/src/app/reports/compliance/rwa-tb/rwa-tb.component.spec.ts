import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RwaTbComponent } from './rwa-tb.component';

describe('RwaTbComponent', () => {
  let component: RwaTbComponent;
  let fixture: ComponentFixture<RwaTbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwaTbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwaTbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
