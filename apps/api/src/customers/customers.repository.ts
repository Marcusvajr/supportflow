import type { CreateCustomerInput, Customer, CustomerListQuery, CustomerPage, UpdateCustomerInput } from './customer';

export class DuplicateCustomerReferenceError extends Error {
  constructor() {
    super('Duplicate customer reference');
    this.name = 'DuplicateCustomerReferenceError';
  }
}

export abstract class CustomersRepository {
  abstract list(query: CustomerListQuery): Promise<CustomerPage>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract create(input: CreateCustomerInput): Promise<Customer>;
  abstract update(id: string, input: UpdateCustomerInput): Promise<Customer | null>;
}
