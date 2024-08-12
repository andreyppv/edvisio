import { Module } from '@nestjs/common';
import { LogsModule } from 'src/modules/logs/logs.module';
import { ProductService } from './product/product.service';
import { RulesService } from './product/rules/rules.service';

@Module({
  imports: [LogsModule],
  providers: [ProductService, RulesService],
})
export class UnderwritingModule {}
