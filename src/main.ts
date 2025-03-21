import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true
    });

    app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? 'apply-service' : '')

    // Enable CORS for Swagger UI
    app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Application API')
        .setDescription("HackCC Question and Application Service")
        .setVersion('1.0')
        .addTag('application')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'access-token',
        )
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(
        process.env.NODE_ENV === 'production' ? 'apply-service/docs' : 'docs', 
        app, 
        documentFactory
    );
    
    await app.listen(3000);
}
bootstrap();
