const express = require("express");
const Sequelize = require("sequelize");
const morgan = require("morgan");
const dotenv = require("dotenv");
const operators_metrics = require("../models/operators_metrics");

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sequelize = new Sequelize(`postgres://${process.env.DATABASE_URL}`, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

const app = express();
const port = 3000;
app.use(express.json());
app.use(morgan("combined"));

const OpeartorsMetrics = operators_metrics(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });

app.post("/metrics", async (req, res) => {
  // validate the request body
  const metrics = req.body;
  if (!Array.isArray(metrics)) {
    return res.status(400).send("Invalid request body");
  }

  const invalidMetrics = metrics.filter(
    (metric) =>
      !metric.dataObjectId ||
      !metric.dataObjectType ||
      !metric.region ||
      !metric.distributionBucketId ||
      !metric.workerId ||
      !metric.nodeEndpoint ||
      !metric.url ||
      !metric.status ||
      !metric.time ||
      (metric.status !== "success" &&
        metric.status !== "failure" &&
        metric.status !== "timeout") ||
      (metric.status === "success" && !metric.responseTime)
  );
  console.log(invalidMetrics);
  if (invalidMetrics.length > 0) {
    return res.status(400).send("Invalid metrics");
  }

  try {
    try {
      await OpeartorsMetrics.bulkCreate(
        metrics.map((metric) => ({ ...metric }))
      );
    } catch (e) {
      console.log("Error inserting data", e);
      res.status(500).send("Error inserting data");
      return;
    }

    res.send("Inserted!");
  } catch (e) {
    console.log("Error inserting data", e);
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
