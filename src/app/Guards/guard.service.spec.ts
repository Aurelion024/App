import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { GuardService } from './guard.service';


describe('GuardService', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => GuardService(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
