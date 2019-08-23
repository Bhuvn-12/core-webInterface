import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RwaAlComponent } from './rwa-al.component';

describe('RwaAlComponent', () => {
  let component: RwaAlComponent;
  let fixture: ComponentFixture<RwaAlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwaAlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwaAlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
