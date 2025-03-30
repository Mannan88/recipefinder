import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import env from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-local';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('main.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
});

app.get('/about-us', (req, res) => {
    res.render('about.ejs');
});

app.get('/recipe', (req, res) => {
    res.render('recipe.ejs');   
});

app.post('/login', (req, res) => {

});

app.post('/searchByIngrediants', (req, res) => {

})

app.post('/searchByRecipe', (req, res) => {

})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});