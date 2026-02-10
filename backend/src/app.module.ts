import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    //Serve static assets for Vue frontend out of /backend/public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    //API for saving and retrieving historical game positions
    PositionsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
