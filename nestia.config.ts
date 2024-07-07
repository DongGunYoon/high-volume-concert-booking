import { INestiaConfig } from '@nestia/sdk';

const NESTIA_CONFIG: INestiaConfig = {
  input: ['src/**/*.controller.ts'],
  swagger: {
    output: 'swagger.json',
    beautify: true,
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
  },
};
export default NESTIA_CONFIG;
