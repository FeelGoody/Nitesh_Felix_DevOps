import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import ejs from 'ejs';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "appdb",
    password: "postgres",
    port: "5432"
});
db.connect();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/up', async (req, res) => {
    let email = req.body.start; 
    let pass = req.body.end;
    try {
        await db.query("INSERT INTO signup (email, password) VALUES ($1, $2)", [email, pass]);
        res.render('index.ejs');
    } catch (error) {
        console.log(error);
        res.send("Error Occurred");
    }
});

app.post('/submit', async (req, res) => {
    try {
        const result = await db.query("SELECT email, password FROM signup WHERE email=$1 AND password=$2", [req.body.first, req.body.pass]);

        if (result.rows.length > 0) {
            res.render('home.ejs');
        } else {
            res.send("Invalid Credentials");
        }
    } catch (error) {
        console.log(error);
        res.send("Error Occurred");
    }
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.get('/signin', (req, res) => {
    res.render('index.ejs');
});
