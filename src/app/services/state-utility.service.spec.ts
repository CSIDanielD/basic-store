import { TestBed } from '@angular/core/testing';

import { StateUtilityService } from './state-utility.service';

describe('StateUtilityService', () => {
  let service: StateUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
