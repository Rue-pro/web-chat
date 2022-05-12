import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionsService } from './connections.service';
import { ConnectionEntity } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionEntity])],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
