import { TestBed } from '@angular/core/testing';

import { InvoiceModalService } from './invoice-modal.service';

describe('InvoiceModalService', () => {
  let service: InvoiceModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
