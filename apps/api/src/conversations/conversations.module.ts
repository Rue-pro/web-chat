import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { UserEntity } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';
import { ConversationEntity } from './entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ConversationEntity, MessageEntity]),
    AuthModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}

/*
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'articles/feed', method: RequestMethod.GET },
        { path: 'articles', method: RequestMethod.POST },
        { path: 'articles/:slug', method: RequestMethod.DELETE },
        { path: 'articles/:slug', method: RequestMethod.PUT },
        { path: 'articles/:slug/comments', method: RequestMethod.POST },
        { path: 'articles/:slug/comments/:id', method: RequestMethod.DELETE },
        { path: 'articles/:slug/favorite', method: RequestMethod.POST },
        { path: 'articles/:slug/favorite', method: RequestMethod.DELETE },
      );
  }
}*/
