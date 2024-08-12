import { Controller } from '@nestjs/common';
import { OutsideService } from './outside.service';

@Controller('outside')
export class OutsideController {
  constructor(private readonly outsideService: OutsideService) {}
}
