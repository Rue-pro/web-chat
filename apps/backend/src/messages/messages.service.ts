import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * getUserFromSocket
   */
  async getUserFromSocket() {}

  async saveMessage(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({ data: createMessageDto });
  }

  async getAllMessages(id: string) {
    return this.prisma.message.findMany({ where: { id: id } });
  }
}
