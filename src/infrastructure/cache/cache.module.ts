import { Global, Module } from '@nestjs/common';
import { CacheModule  } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {

        const redisOptions = {
          url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`, // The Redis server URL (use 'rediss' for TLS)
          password: configService.get<string>('REDIS_PASSWORD'), // Optional password if Redis has authentication enabled
          // socket: {
          //   host: configService.get<string>('REDIS_HOST'), // Hostname of the Redis server
          //   port: parseInt(configService.get<string>('REDIS_PORT')),        // Port number
          //   reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Custom reconnect logic
          //   tls: false, // Enable TLS if you need to connect over SSL
          //   keepAlive: 300000, // Keep-alive timeout (in milliseconds)
          // }
        };

        return {
          stores: [
            new KeyvRedis(redisOptions),
          ],
          ttl: configService.get<number>('REDIS_TTL'),
        }
      },
      inject: [ConfigService],
      isGlobal: true, // Hace que el módulo de caché esté disponible en toda la aplicación
    }),
  ],
  providers: [
    CacheService,
  ],
  exports: [
    CacheService,
  ]
})
export class RedisCacheModule {}


// import { Module } from '@nestjs/common'
// import { Cacheable } from 'cacheable'
// import { CacheService } from './cache.service'
// import KeyvRedis from '@keyv/redis'
// import { ConfigModule, ConfigService } from '@nestjs/config'

// @Module({
//   imports: [ConfigModule],
//   providers: [
//     {
//       provide: 'CACHE_INSTANCE',
//       useFactory: (configService: ConfigService) => {
//         const redisUrl = configService.get<string>('REDIS_URL')
//         const secondary = new KeyvRedis(redisUrl)
//         return new Cacheable({ secondary, ttl: '4h' })
//       },
//       inject: [ConfigService],
//     },
//     CacheService,
//   ],
//   exports: ['CACHE_INSTANCE', CacheService],
// })
// export class CacheModule {}