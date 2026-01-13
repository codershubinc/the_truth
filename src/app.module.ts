import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitGuard } from './rate-limit.guard'; // <--- Import your new guard

@Module({
  imports: [
    // 1. Setup Throttler (Default config, though our Guard overrides this)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 30,
    }]),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 2. Apply the Guard Globally
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule { }