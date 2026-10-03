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

export type CustomerPage = {
  items: Customer[];
  page: number;
  pageSize: number;
  total: number;
};
