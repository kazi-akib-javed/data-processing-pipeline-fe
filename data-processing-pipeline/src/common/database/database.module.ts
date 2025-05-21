import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DB'),
        synchronize: configService.get<boolean>('DATABASE_SYNCRONIZE')&&true,
        autoLoadEntities: configService.get<boolean>('DATABASE_AUTOLOADENTITIES')&&true,
        logging: configService.get<boolean>('DATABASE_LOGGING')&&true,
        //ssl: {rejectUnauthorized: false},
        entities: [],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormConfigModule {}