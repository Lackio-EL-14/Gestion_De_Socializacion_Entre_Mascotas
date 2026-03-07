import { Module } from '@nestjs/common';
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

@Module({
  imports: [AuthModule, 
            UsersModule, 
            PetsModule, 
            MatchesModule, 
            ChatModule, 
            ReportsModule, 
            PublicationsModule, 
            ProfessionalProfileModule,
            TypeOrmModule.forRoot({//
              type: 'mariadb',
              host: 'localhost',
              port: 3306,
              username: 'root',
              password: 'tu_password',
              database: 'dogchat',
              autoLoadEntities: true,
              synchronize: true,
            }),
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
