

require("./Database/database")
require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT
const bodyParser = require("body-parser")
const cors = require("cors");
const user_routes = require("./routes/user_routes");
const job_routes = require("./routes/job_routes");
var cron = require('node-cron');

cron.schedule("0 20,40,0 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18 * * *", () => {
    Axios.get(`https://after-graduation-ck.herokuapp.com/`).then((res) => {
        console.log(res.data)
        console.log(Date(Date.now().toLocaleString()))
    }).catch((err) => {
        console.log(err.response.data);
    })
})

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
