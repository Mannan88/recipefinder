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
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 // 24 hour
    }
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


app.get('/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth');
    }

    try {
        const favoritesResult = await db.query(
            "SELECT recipe_id FROM favourite WHERE user_id = $1", 
            [req.user.id]
        );
       
        const recipeIds = favoritesResult.rows.map(item => item.recipe_id);
        
        const recipePromises = recipeIds.map(async id => {
            try {
                const response = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                const data = await response.json();
                return data.meals ? data.meals[0] : null;
            } catch (error) {
                console.error(`Error fetching recipe ${id}:`, error);
                return null;
            }
        });

        const recipeResults = await Promise.all(recipePromises);
        
        const recipeDetails = recipeResults
            .filter(meal => meal !== null)
            .map(meal => ({
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
            }));

        res.render('profile.ejs', {
            user: req.user,
            recipeDetails: recipeDetails,
            favoritesCount: recipeIds.length
        });

    } catch (error) {
        console.error('Profile load error:', error);
        res.render('profile.ejs', {
            user: req.user,
            error: 'Could not load recipe details'
        });
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

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Server error");
        }
        res.redirect('/');
    })
})

app.post('/favourite-delete', async (req, res) => {
    try {
        await db.query("DELETE FROM favourite WHERE user_id = $1 AND recipe_id = $2", [req.user.id, req.body.mealId]);
        console.log("Recipe meal removed from your favourite list " + req.body.mealId);
    } catch (error) {
        console.error("Error removing recipe from favourites:", error);
        res.status(500).send("An error occurred while removing the recipe from favourites.");
    }
})

app.post('/favourite', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth");
    }
    try {
        const result = await db.query("SELECT * FROM favourite WHERE user_id = $1 AND recipe_id = $2", [req.user.id, req.body.mealId]);
        if(result.rows.length === 0){
            await db.query("INSERT INTO favourite (user_id, recipe_id) VALUES ($1, $2)",[req.user.id, req.body.mealId]);
            console.log("Recipe meal added to your favourite list " + req.body.mealId);
            res.redirect("/home");
        }
        else{
            console.log(`Recipe ${req.body.mealId} is already in favorites for user ${req.user.id}`);
            res.status(200).send("Recipe is already in your favorites.");
        }
        
    } catch (error) {
        console.error("Error adding recipe to favorites:", error);
        res.status(500).send("An error occurred while adding the recipe to favorites.");
    }
    
});


app.post('/searchByRecipe', async (req, res) => {
    const recipeName = req.body.recipe;

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
        const data = await response.json();

        const recipes = data.meals
            ? data.meals.map(meal => ({
                  idMeal: meal.idMeal,
                  strMeal: meal.strMeal,
                  strMealThumb: meal.strMealThumb
              }))
            : [];

        res.json({ recipes });
    } catch (error) {
        console.error("Error searching recipe:", error);
        res.json({ recipes: [] });
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
          console.log("img", profile.picture);

          if (!profile.emails || profile.emails.length === 0) {
            return cb(new Error("No email found in Google profile"));
          }

          const result = await db.query("SELECT * FROM users WHERE email = $1", [
            profile.email,
          ]);
          if (result.rows.length === 0) {
            const newUser = await db.query(
              "INSERT INTO users (email, password, google_id, img) VALUES ($1, $2, $3, $4) RETURNING *",
              [profile.email, "google", profile.id, profile.picture]
            );
            console.log("newUser: ", newUser.rows[0]);
            return cb(null, newUser.rows[0]);
          } else {
            const user = result.rows[0];
            if(user.google_id === null) {
                const updatedUser = await db.query("UPDATE users SET google_id = $1, img = $2 WHERE email = $3 RETURNING *", [profile.id,profile.picture, profile.email])
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
    cb(null, user.id);
})

passport.deserializeUser(async (id, cb) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id])
        if(result.rows.length > 0){
            cb(null, result.rows[0]);
        }
        else{
            cb("User not found");
        }
    } catch (error) {
        cb(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
