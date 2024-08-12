import { ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, PipeTransform } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { ApplicationStatusDto } from '../dto/application-by-status.dto';

@Injectable()
export class ApplicationStatusValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const applicationStatus = new ApplicationStatusDto();
    applicationStatus.status = value;
    const error = validateSync(applicationStatus);
    if (error.length > 0) {
      throw new HttpException(
        'Status must be one of the values: pending_certification, incomplete, pending_esignature, certified or all',
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
