import { TestBed } from '@angular/core/testing';

import { ActionProviderService } from './action-provider.service';

describe('ActionProviderService', () => {
  let service: ActionProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
