import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const config = {
    type: 'postgres',
    host:  'localhost',
    port: parseInt('6432'),
    username: 'postgres',
    password: 'postgres',
    database: 'clean_architecture',
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/src/infrastructure/persistence/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);