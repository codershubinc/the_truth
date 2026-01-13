import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static'; // <--- Import this
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configure the static server
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'), // Points to your 'client' folder
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }