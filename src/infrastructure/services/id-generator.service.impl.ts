import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.interface';
import { Global, Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid'; 
import { v7 as uuidv7 } from 'uuid'; 


@Injectable()
export class IdGeneratorServiceImpl implements IdGeneratorService {
  generateId(): string {
    return uuidv7();
  }
}