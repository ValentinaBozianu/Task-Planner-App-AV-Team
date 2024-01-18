require('dotenv').config(); // Asigură-te că ai instalat pachetul dotenv
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Instalează pachetul cors dacă este necesar
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permiterea cererilor CORS
app.use(bodyParser.json());


// Încărcarea variabilelor de mediu
require('dotenv').config();

// Conectarea la MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexiunea la MongoDB a fost stabilită cu succes.');
}).catch(err => {
  console.error('Eroare la conectarea la MongoDB:', err);
});


app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


app.use((err, req, res, next) => { 
  console.error(err.stack);
res.status(500).send('Something broke!');
});



app.listen(PORT, () => {
console.log(`Serverul rulează pe portul ${PORT}`);
});