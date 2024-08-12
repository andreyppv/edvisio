import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [InstallerController],
  providers: [InstallerService]
})
export class InstallerModule {}
