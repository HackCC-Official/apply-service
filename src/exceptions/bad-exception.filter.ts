import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestLoggingFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.getResponse();

    this.logger.warn(
      `400 Bad Request: ${request.method} ${request.url} - ${JSON.stringify(
        message,
      )}`,
    );

    response.status(status).json(message);
  }
}