export type Customer = {
  id: string;
  referenceCode: string;
  name: string;
  documentMasked: string | null;
  phoneMasked: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerInput = {
  referenceCode: string;
  name: string;
  documentMasked?: string | null;
  phoneMasked?: string | null;
  city?: string | null;
};

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export type CustomerListQuery = {
  q?: string;
  page: number;
  pageSize: number;
};

export type CustomerPage = {
  items: Customer[];
  page: number;
  pageSize: number;
  total: number;
};
