import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitymodalPage } from './citymodal.page';

describe('CitymodalPage', () => {
  let component: CitymodalPage;
  let fixture: ComponentFixture<CitymodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitymodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitymodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
