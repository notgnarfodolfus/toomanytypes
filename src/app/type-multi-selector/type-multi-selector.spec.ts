import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMultiSelector } from './type-multi-selector';

describe('TypeMultiSelector', () => {
  let component: TypeMultiSelector;
  let fixture: ComponentFixture<TypeMultiSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeMultiSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeMultiSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
