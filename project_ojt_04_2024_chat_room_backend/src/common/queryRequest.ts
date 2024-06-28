import { FindOptionsOrderValue } from 'typeorm';

export interface QueryRequest {
  sort?: FindOptionsOrderValue;
  search?: string;
  limit?: number;
  page?: number;
  messageId?: number;
  up?: number;
  down?: number;
}
