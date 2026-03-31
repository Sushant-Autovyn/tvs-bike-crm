import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeCatalog } from './bike-catalog';

describe('BikeCatalog', () => {
  let component: BikeCatalog;
  let fixture: ComponentFixture<BikeCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
