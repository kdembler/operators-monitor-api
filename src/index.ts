import { TestResult, testResultSchema } from "./schema.js";
import { ZodError } from "zod";
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

dotenv.config();

if (!process.env.ELASTICSEARCH_URL) {
  console.error("ELASTICSEARCH_URL not set");
  process.exit(1);
}
if (!process.env.ELASTICSEARCH_USERNAME) {
  console.error("ELASTICSEARCH_USERNAME not set");
  process.exit(1);
}
if (!process.env.ELASTICSEARCH_PASSWORD) {
  console.error("ELASTICSEARCH_PASSWORD not set");
  process.exit(1);
}

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});
try {
  if (!(await esClient.ping())) {
    throw new Error("Ping failed");
  }
} catch (e) {
  console.error("Failed to connect to Elasticsearch");
  console.error(e);
  process.exit(1);
}

async function handleResultsRequest(
  body: any
): Promise<{ body: object; status?: number }> {
  try {
    const testResults = testResultSchema.array().parse(body);
    await sendResults(testResults);
    return { body: { success: true } };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        body: e.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
        status: 400,
      };
    }
    return { body: { message: (e as any)?.message }, status: 500 };
  }
}

async function sendResults(results: TestResult[]) {
  const body = results.flatMap((result) => [
    { index: { _index: "distributor-monitoring" } },
    result,
  ]);
  try {
    await esClient.bulk({ body });
  } catch (e) {
    console.error("Failed to send results to Elasticsearch");
    console.error(e);
  }
}

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.post("/metrics", async (req, res) => {
  const response = await handleResultsRequest(req.body);
  res.status(response.status ?? 200).json(response.body);
});
app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});
