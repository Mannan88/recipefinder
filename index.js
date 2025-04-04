import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import env from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-local';
import GoogleStrategy from "passport-google-oauth2"
import fetch from 'node-fetch';

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
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
db.connect();

app.get('/', (req, res) => {
    res.render('main.ejs');
});

app.get('/auth', (req, res) => {
    res.render('auth.ejs');
});

app.get('/about-us', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('about-us.ejs');
    } else {
        res.redirect('/auth');
    }   
});
app.get('/recipe/:id', async (req, res) => {
    const mealId = req.params.id;
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();

        if (!data.meals) {
            return res.render("recipe.ejs", { recipe: null });
        }

        res.render("recipe.ejs", { recipe: data.meals[0] });
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        res.render("recipe.ejs", { recipe: null });
    }
});


app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

app.get("/auth/google/home", passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/login",
}))

app.get("/home", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth");
    }

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();

        res.render("home.ejs", { recipes: data.meals || [] });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.render("home.ejs", { recipes: [] });
    }
});

app.post('/searchByRecipe', async (req, res) => {
    const recipeName = req.body.recipe;
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
        const data = await response.json();

        res.render("home.ejs", { recipes: data.meals || [] });
    } catch (error) {
        console.error("Error searching recipe:", error);
        res.render("home.ejs", { recipes: [] });
    }
});

app.post('/searchByIngrediants', async (req, res) => {
    const ingredients = req.body.ingredients; 
    const recipesPromises = ingredients.map(ingredient =>
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.json())
            .catch(error => console.error(`Error fetching recipes for ${ingredient}:`, error))
    );

    try {
        const responses = await Promise.all(recipesPromises);
        const recipesData = responses.map(response => response.meals || []);
        
        let commonRecipes = recipesData.reduce((acc, curr) => {
            return acc.filter(recipe => curr.some(r => r.idMeal === recipe.idMeal));
        });

        if (commonRecipes.length === 0) {
            commonRecipes = recipesData[0];
        }

        res.json({ recipes: commonRecipes });
    } catch (error) {
        console.error("Error searching by ingredients:", error);
        res.json({ recipes: [] });
    }
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

passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' }, async function verify(email, password, cb ) {
    try {
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
            return done(null, false, { message: "Incorrect password" });
        }
    } catch (error) {
        console.log('Error querying database:', error);
        return cb(error);
    }
}));

passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/home",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          console.log("Google profile", profile);

          if (!profile.emails || profile.emails.length === 0) {
            return cb(new Error("No email found in Google profile"));
          }

          const result = await db.query("SELECT * FROM users WHERE email = $1", [
            profile.email,
          ]);
          if (result.rows.length === 0) {
            const newUser = await db.query(
              "INSERT INTO users (email, password, google_id) VALUES ($1, $2, $3) RETURNING *",
              [profile.email, "google", profile.id]
            );
            console.log("newUser: ", newUser.rows[0]);
            return cb(null, newUser.rows[0]);
          } else {
            const user = result.rows[0];
            if(user.google_id === null) {
                const updatedUser = await db.query("UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *", [profile.id, profile.email])
                console.log("updatedUser: ", updatedUser.rows[0]);
                return cb(null, updatedUser.rows[0]);
            }
            else {
                console.log("user: ",user);
                return cb(null, result.rows[0]);
            }
            
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );


passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
