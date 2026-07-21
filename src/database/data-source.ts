// import * as dotenv from 'dotenv';
// dotenv.config();
// import { DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//     type: 'mysql',
//     host: process.env.DB_HOST ?? 'localhost',
//     port: Number(process.env.DB_PORT ?? 3306),
//     username: process.env.DB_USERNAME ?? 'root',
//     password: process.env.DB_PASSWORD ?? '',
//     database: process.env.DB_NAME ?? 'mep',
//     synchronize: false, // ❌ NEVER true in prod
//     logging: false,
//     timezone: 'Z',
//     charset: 'utf8mb4',
// };


import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'mep',

    synchronize: false, // ❌ NEVER true in prod
    logging: false,
    timezone: 'Z',
    charset: 'utf8mb4',
};
