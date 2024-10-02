import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

// nombre del encabezado HTTP para el identificador de la petición
export const correlation_id_header = 'x-correlation-id';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('hola, estoy insertando el correlation id');

    // identificador unico para la request
    const id = randomUUID();

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // agregar el identificador y encabezado de la respuesta para seguimiento de los logs
    req[correlation_id_header] = id;

    // agregar el identificador y encabezado a la respuesta para el cliente
    res.setHeader(correlation_id_header, id);
    return next.handle();
  }
}
