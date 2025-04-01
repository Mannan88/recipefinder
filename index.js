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
const saltRounds = 10;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
    }
}));
   

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Needed for Render
});
db.connect();

app.get('/', (req, res) => {
    res.render('main.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.get('/home', (req, res) => {
    res.render('home.ejs');
        })

app.get('/about-us', (req, res) => {
    res.render('about.ejs');
});

app.get('/recipe', (req, res) => {
    res.render('recipe.ejs');
});

app.post('/login', (req, res, next) => {
    console.log('Login route triggered:', req.body);
    next();
}, passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
}));

app.post('/register', async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
        if (result.rows.length === 0) {
            bcrypt.hash(userPassword, saltRounds, async (error, hash) => {
                if (error) {
                    console.log('Error hashing password:', error);
                    res.status(500).send('Server error');
                }
                else {
                    try {
                        const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [userEmail, hash]);
                        console.log('User registered:', result.rows[0]);
                        req.login(result.rows[0], (err)=>{
                            if (err) {
                                console.log('Error logging in user:', err);
                                res.status(500).send('Server error');
                            }
                            else {
                                res.redirect('/home');
                            }
                        })
                    } catch (error) {
                        console.log('Error inserting user:', error);
                        res.status(500).send('Server error');
                    }  
                }
            })
        }
    } catch (error) {
        console.log('Error querying database:', error);
        res.status(500).send('Server error');
    }
});

app.post('/searchByIngrediants', (req, res) => {

});

app.post('/searchByRecipe', (req, res) => {

});

passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' }, async function verify(email, password, cb ) { // customize the field names to match your form
    try {
        console.log('passport-local strategy triggered');
        console.log('email:', email);
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                }
                else{
                    if (result) {
                        return cb(null, user);
                    }
                    else {
                        return cb(null, false);
                    }
                }
            });
        }
        else{
            return cb("User not found");
        }
    } catch (error) {
        console.log('Error querying database:', error);
        return cb(error);
    }
}));


passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

