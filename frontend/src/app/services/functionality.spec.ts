import { TestBed } from '@angular/core/testing';

import { Functionality } from './functionality';

describe('Functionality', () => {
  let service: Functionality;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Functionality);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
