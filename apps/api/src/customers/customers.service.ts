import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCustomerInput, Customer, CustomerPage, UpdateCustomerInput } from './customer';
import { CustomersRepository, DuplicateCustomerReferenceError } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(@Inject(CustomersRepository) private readonly repository: CustomersRepository) {}

  async list(q: string | undefined, pageValue: string | undefined, pageSizeValue: string | undefined): Promise<CustomerPage> {
    const page = this.parsePositiveInteger(pageValue, 1, 100000);
    const pageSize = this.parsePositiveInteger(pageSizeValue, 20, 100);
    const query = q?.trim().slice(0, 80) || undefined;
    return await this.repository.list({ q: query, page, pageSize });
  }

  async get(id: string): Promise<Customer> {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundException('Cliente não encontrado.');
    return customer;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    const normalized = this.normalizeCreate(input);
    try {
      return await this.repository.create(normalized);
    } catch (error) {
      if (error instanceof DuplicateCustomerReferenceError) {
        throw new ConflictException('Já existe um cliente com este código de referência.');
      }
      throw error;
    }
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    if (!input || typeof input !== 'object' || Object.keys(input).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualização.');
    }
    const normalized = this.normalizeUpdate(input);
    try {
      const customer = await this.repository.update(id, normalized);
      if (!customer) throw new NotFoundException('Cliente não encontrado.');
      return customer;
    } catch (error) {
      if (error instanceof DuplicateCustomerReferenceError) {
        throw new ConflictException('Já existe um cliente com este código de referência.');
      }
      throw error;
    }
  }

  private normalizeCreate(input: CreateCustomerInput): CreateCustomerInput {
    if (!input || typeof input !== 'object') throw new BadRequestException('Dados do cliente são obrigatórios.');
    return {
      referenceCode: this.referenceCode(input.referenceCode),
      name: this.requiredText(input.name, 'nome', 2, 120),
      documentMasked: this.optionalText(input.documentMasked, 'documento', 30),
      phoneMasked: this.optionalText(input.phoneMasked, 'telefone', 30),
      city: this.optionalText(input.city, 'cidade', 80),
    };
  }

  private normalizeUpdate(input: UpdateCustomerInput): UpdateCustomerInput {
    const output: UpdateCustomerInput = {};
    if (input.referenceCode !== undefined) output.referenceCode = this.referenceCode(input.referenceCode);
    if (input.name !== undefined) output.name = this.requiredText(input.name, 'nome', 2, 120);
    if (input.documentMasked !== undefined) output.documentMasked = this.optionalText(input.documentMasked, 'documento', 30);
    if (input.phoneMasked !== undefined) output.phoneMasked = this.optionalText(input.phoneMasked, 'telefone', 30);
    if (input.city !== undefined) output.city = this.optionalText(input.city, 'cidade', 80);
    return output;
  }

  private referenceCode(value: unknown): string {
    const code = this.requiredText(value, 'código de referência', 2, 40).toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(code)) {
      throw new BadRequestException('O código de referência aceita apenas letras, números, hífen e sublinhado.');
    }
    return code;
  }

  private requiredText(value: unknown, field: string, min: number, max: number): string {
    if (typeof value !== 'string') throw new BadRequestException(`O campo ${field} é obrigatório.`);
    const text = value.trim();
    if (text.length < min || text.length > max) {
      throw new BadRequestException(`O campo ${field} deve ter entre ${min} e ${max} caracteres.`);
    }
    return text;
  }

  private optionalText(value: unknown, field: string, max: number): string | null {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value !== 'string') throw new BadRequestException(`O campo ${field} é inválido.`);
    const text = value.trim();
    if (text.length > max) throw new BadRequestException(`O campo ${field} deve ter no máximo ${max} caracteres.`);
    return text || null;
  }

  private parsePositiveInteger(value: string | undefined, fallback: number, max: number): number {
    if (value === undefined) return fallback;
    if (!/^\d+$/.test(value)) throw new BadRequestException('Parâmetro de paginação inválido.');
    const parsed = Number(value);
    if (parsed < 1 || parsed > max) throw new BadRequestException('Parâmetro de paginação inválido.');
    return parsed;
  }
}
