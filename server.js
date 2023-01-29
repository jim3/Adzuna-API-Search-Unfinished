const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;
const appID = `${process.env.APP_ID}`;
const baseURL = `https://api.adzuna.com/v1/api`;
const endpoint = `/jobs/us/search/1?app_id=${appID}&app_key=${apiKey}`;
const query = `&results_per_page=10&what=${"javascript%20nodejs"}&where=31721&distance=325`;
const url = `${baseURL}${endpoint}${query}`;


const salary = async (data, minSalary) => {
    try {
        const filteredJobs = data.results.filter((job) => job.salary_max <= minSalary);
        const salary_amount = filteredJobs.map((job) => job.salary_max);
        return salary_amount;
    } 
    catch (error) {
        console.log(error);
    }
};

const search = async (url, minSalary) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return salary(data, minSalary);
    } 
    catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    const minSalary = req.body.salary;
    const salary = await search(url, minSalary);
    res.render("index", {
        salary: salary,
    });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("ERROR created in app.use");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
