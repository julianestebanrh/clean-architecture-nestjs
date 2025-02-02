import { registerAs } from '@nestjs/config';

export default registerAs('logging', () => ({
  seqUrl: process.env.SEQ_URL || 'http://localhost:5341',
  seqApiKey: process.env.SEQ_API_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
  environment: process.env.NODE_ENV || 'development',
  serviceName: process.env.SERVICE_NAME || 'api'
}));