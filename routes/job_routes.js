

const router = require('express').Router();
const job_controllers = require("../controllers/job_controllers")

router.post('/addJob', job_controllers.addJob);


router.get('/getAllJobs', job_controllers.getAllJobs);


module.exports = router