import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifysrcComponent } from './modifysrc.component';

describe('ModifysrcComponent', () => {
  let component: ModifysrcComponent;
  let fixture: ComponentFixture<ModifysrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifysrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifysrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
