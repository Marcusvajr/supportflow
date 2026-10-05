import type { Customer, CustomerPage } from './customer-types';

type CustomerClient = { request<T>(path: string): Promise<T> };

/** Collect every API page so the ticket form does not silently omit customers. */
export async function loadCustomerOptions(client: CustomerClient): Promise<Customer[]> {
  const customers: Customer[] = [];
  let pageNumber = 1;
  let total = 0;
  do {
    const page = await client.request<CustomerPage>(`/customers?page=${pageNumber}&pageSize=100`);
    total = page.total;
    if (page.items.length === 0 && customers.length < total) {
      throw new Error('Não foi possível carregar todos os clientes.');
    }
    customers.push(...page.items);
    pageNumber += 1;
  } while (customers.length < total);
  return customers;
}
