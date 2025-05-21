import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env['NODE' + '_ENV'];
const envFilePath = [`env/${ENV ? `.env.${ENV}` : `.env`}`];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath
    }),
  ],
})
export class EnvConfigModule {}