import { Module } from '@nestjs/common';
import { UnderwritingModule } from './underwriting/underwriting.module';
import { ProductService } from './underwriting/product/product.service';

@Module({
    imports: [
      UnderwritingModule
    ],
  })
export class LoanModule {}
