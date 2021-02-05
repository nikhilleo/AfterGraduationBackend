

require("./Database/database")
require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT
const bodyParser = require("body-parser")
const cors = require("cors");
const user_routes = require("./routes/user_routes");
const job_routes = require("./routes/job_routes");

app.use(cors());

app.use(bodyParser.json());

app.use("/jobs",job_routes);

app.use(user_routes)

app.get('/', (req, res) => {
    res.send("Hello World")
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});