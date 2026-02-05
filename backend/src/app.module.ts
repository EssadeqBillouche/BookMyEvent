import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { RegistrationModule } from './registration/registration.module';
import { typeOrmConfig } from 'config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ 
            UserModule,
            AuthModule,
            EventModule,
            RegistrationModule,
            ConfigModule.forRoot({isGlobal : true}),
            TypeOrmModule.forRootAsync(typeOrmConfig)
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
