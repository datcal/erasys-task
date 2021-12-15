import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CliHelperService } from './cli-helper.service';
import { CliHelperRepository } from './cli-helper.repository';
import { Password } from '../entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [CliHelperService, CliHelperRepository],
})
export class CliHelperModule {}
