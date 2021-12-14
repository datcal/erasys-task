import { Module } from '@nestjs/common';
import { CliHelperService } from './cli-helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './password.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [CliHelperService],
})
export class CliHelperModule {}
