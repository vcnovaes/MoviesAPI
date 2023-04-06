const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./dist/User/UserRouter.js']

swaggerAutogen(outputFile, endpointsFiles)