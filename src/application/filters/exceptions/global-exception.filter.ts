import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '@domain/abstractions/error';
import { ILoggerService } from '@domain/abstractions/logging/logger.interface';

interface ProblemDetail {
  // type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
  errors?: any[];
  timestamp: string;
  traceId?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let problem: ProblemDetail;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody: any = exception.getResponse();

      // Si es un error de validación de class-validator
      if (responseBody.message && Array.isArray(responseBody.message)) {

        problem = {
          // type: 'https://api.yourdomain.com/errors/validation',
          title: 'Validation Error',
          status,
          detail: 'Command validation failed',
          code: 'VALIDATION.FAILED',
          instance: request.url,
          errors: responseBody.message,
          timestamp: new Date().toISOString(),
          traceId: request.id
        };

        this.logger.error('Validation error', null, problem);
      }
      // Si es un Result.failure del dominio
      else if (responseBody instanceof AppError) {
        problem = {
          // type: 'https://api.yourdomain.com/errors/domain',
          title: responseBody.code,
          status,
          detail: responseBody.message,
          code: responseBody.code,
          instance: request.url,
          timestamp: new Date().toISOString(),
          traceId: request.id
        };

        this.logger.error('Domain error', null, problem);

      }
      // Otros HttpExceptions
      else {
        problem = {
          // type: 'https://api.yourdomain.com/errors/http',
          title: 'HTTP Error',
          status,
          detail: responseBody.message || exception.message,
          code: responseBody.code || `HTTP.${status}`,
          instance: request.url,
          timestamp: new Date().toISOString(),
          traceId: request.id
        };

        this.logger.error('HTTP Error', null, problem);

      }
    }
    // Errores no controlados
    else {
      problem = {
        // type: 'https://api.yourdomain.com/errors/internal',
        title: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        detail: 'An unexpected error occurred',
        code: 'INTERNAL.SERVER_ERROR',
        instance: request.url,
        timestamp: new Date().toISOString(),
        traceId: request.id
      };

      this.logger.error('Internal Server Error', null, problem);
    }

    response.setHeader('Content-Type', 'application/problem+json');
    return response.status(problem.status).json(problem);
  }
}