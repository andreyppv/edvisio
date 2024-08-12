import { EntityRepository, Repository } from 'typeorm';
import { uploadUserDocument } from '../entities/userUploadDocument.entity';

@EntityRepository(uploadUserDocument)
export class UploadUserDocumentRepository extends Repository<
  uploadUserDocument
> {}
