import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccessControlModule } from './access-control/access-control.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, AuthModule, UserModule, AccessControlModule, ProductModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
