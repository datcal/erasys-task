import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from '../entities/password.entity';
import { CliHelperService } from './cli-helper.service';
import { CliHelperRepository } from './cli-helper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [CliHelperService, CliHelperRepository],
})
export class CliHelperModule {}
