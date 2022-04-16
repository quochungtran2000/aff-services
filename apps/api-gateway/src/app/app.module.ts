import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MobileModule } from './mobile/mobile.module';
import { AuthModule } from './auth/auth.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [AdminModule, MobileModule, AuthModule, WebsiteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
