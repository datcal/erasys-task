import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CliHelperService } from './cli-helper.service';
import { Password } from './password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [CliHelperService],
})
export class CliHelperModule {}
