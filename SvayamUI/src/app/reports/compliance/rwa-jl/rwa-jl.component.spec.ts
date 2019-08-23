import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RwaJlComponent } from './rwa-jl.component';

describe('RwaJlComponent', () => {
  let component: RwaJlComponent;
  let fixture: ComponentFixture<RwaJlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwaJlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwaJlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
