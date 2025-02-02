"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionSource = void 0;
var config_1 = require("@nestjs/config");
var typeorm_1 = require("typeorm");
var config = {
    type: 'postgres',
    host: 'localhost',
    port: parseInt('6432'),
    username: 'postgres',
    password: 'postgres',
    database: 'clean_architecture',
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/src/infrastructure/persistence/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
};
exports.default = (0, config_1.registerAs)('typeorm', function () { return config; });
exports.connectionSource = new typeorm_1.DataSource(config);
