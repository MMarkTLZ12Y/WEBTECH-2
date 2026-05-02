import { TestBed } from '@angular/core/testing';

import { Munkaora } from './munkaora';

describe('Munkaora', () => {
  let service: Munkaora;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Munkaora);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
