import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { MobileModule } from './mobile/mobile.module';
import { AuthModule } from './auth/auth.module';
import { WebsiteModule } from './website/website.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { HeaderMiddleware } from './middlewares/header.middleware';
// import { AppNameMiddleWare } from './middlewares/app-name.middleware';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config/configurations';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '1d' },
    }),
    AdminModule,
    MobileModule,
    AuthModule,
    WebsiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*').apply(HeaderMiddleware).forRoutes('*');
    // .apply(AppNameMiddleWare)
    // .forRoutes(
    //   { path: 'admin/*', method: RequestMethod.ALL },
    //   { path: 'mobile/*', method: RequestMethod.ALL },
    //   { path: 'website/*', method: RequestMethod.ALL }
    // );  }
}
}

