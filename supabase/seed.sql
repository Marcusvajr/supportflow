insert into public.customers (reference_code, name, document_masked, phone_masked, city)
values
  ('DEMO-001', 'Cliente Demonstração Norte', '***.***.***-01', '(31) *****-0001', 'Lagoa Santa'),
  ('DEMO-002', 'Cliente Demonstração Centro', '***.***.***-02', '(31) *****-0002', 'Vespasiano')
on conflict (reference_code) do nothing;
