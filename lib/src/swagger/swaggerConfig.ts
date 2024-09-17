import swaggerJSDoc from 'swagger-jsdoc';

// Swaggerの設定
const swaggerDefinition = {
    basePath: '/',
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
        description: 'Loading and retrieving data from firebase firestore',
    },
    servers: [{ url: 'http://localhost:3000/' }],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ['./**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
