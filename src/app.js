// require('reflect-metadata'); // Required by TypeORM
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON
const userRoutes = require('./routs/index.js');
app.use(cors());
app.use('/user', userRoutes);
// app.use('/home', homeRouts);

app.get('/test', (req, res) => {
    res.send("test string from orm ")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
