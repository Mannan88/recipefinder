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

app.get('/auth', (req, res) => {
    res.render('auth.ejs');
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
        })

app.get('/about-us', (req, res) => {
    res.render('about.ejs');
});


app.get('/recipe', (req, res) => {
    res.render('recipe.ejs');
});


app.post('/auth', async (req, res, next) => {
    const { action, email, password } = req.body;

    if (action === "login") {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error("Error during authentication:", err);
                return res.status(500).send("Server error");
            }
            if (!user) {
                return res.redirect("/auth");
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error("Error logging in user:", err);
                    return res.status(500).send("Server error");
                }
                return res.redirect("/home"); 
            });
        })(req, res, next);
    } 
    
    else if (action === "register") {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

            if (result.rows.length === 0) {
                bcrypt.hash(password, saltRounds, async (error, hash) => {
                    if (error) {
                        console.error("Error hashing password:", error);
                        return res.status(500).send("Server error");
                    }

                    try {
                        const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hash]);
                        req.login(newUser.rows[0], (err) => {
                            if (err) {
                                console.error("Error logging in user:", err);
                                return res.status(500).send("Server error");
                            }
                            return res.redirect("/home");
                        });
                    } catch (insertError) {
                        console.error("Error inserting user:", insertError);
                        return res.status(500).send("Server error");
                    }
                });
            } else {
                return res.redirect("/register"); 
            }
        } catch (queryError) {
            console.error("Error querying database:", queryError);
            return res.status(500).send("Server error");
        }
    } 
    
    else {
        return res.status(400).send("Invalid action");
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

