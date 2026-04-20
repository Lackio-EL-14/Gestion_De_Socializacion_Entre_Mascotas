import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PetsModule } from './modules/pets/pets.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ProfessionalProfileModule } from './modules/professional-profile/professional-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
            ConfigModule.forRoot({
              isGlobal: true,
            }),
            UploadModule,
            AuthModule, 
            UsersModule, 
            PetsModule, 
            MatchesModule, 
            ChatModule, 
            ReportsModule, 
            PublicationsModule, 
            ProfessionalProfileModule,
            TypeOrmModule.forRoot({//
              type: 'mariadb',
              host: process.env.DB_HOST,
              port: 27497,
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_DATABASE,
              autoLoadEntities: true,
              synchronize: true,

              ssl: {
                rejectUnauthorized: false,
              },

            }),
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
