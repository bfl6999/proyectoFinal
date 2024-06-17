const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(bodyParser.json());

// Rutas
const authRoutes = require('./routes/auth');
const trackRoutes = require('./routes/tracks');
const commentRoutes = require('./routes/comments');
const recommendationRoutes = require('./routes/recommendations');

//Uso de front
const cors = require('cors');
app.use(cors());

// Middleware para rutas
app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Ruta base para comprobar si el servidor está funcionando
app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Configuración Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Spotify API',
            version: '1.0.0',
            description: 'API for managing Spotify data',
            contact: {
                name: 'Developer',
            },
            servers: [{ url: 'http://localhost:3000' }],
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
