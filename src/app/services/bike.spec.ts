import { TestBed } from '@angular/core/testing';

import { Bike } from './bike';

describe('Bike', () => {
  let service: Bike;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bike);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
