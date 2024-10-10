const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passwords', passwordRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});