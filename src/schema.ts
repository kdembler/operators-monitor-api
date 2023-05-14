import z from "zod";

export const testResultSchema = z
  .object({
    time: z.string().refine((s) => new Date(s) instanceof Date),
    dataObjectId: z.string(),
    dataObjectType: z.string(),
    distributionBucketId: z.string(),
    workerId: z.number().int(),
    nodeEndpoint: z.string().url(),
    url: z.string().url(),
    status: z.enum(["success", "failure", "timeout"]),
    responseTime: z.number().nullish(),
    statusCode: z.number().int().nullish(),
    timeout: z.number().int().nullish(),
    body: z.string().nullish(),
    region: z.string().nullish(),
  })
  .refine((data) => data.status !== "success" || data.responseTime != null, {
    message: "If status is 'success', responseTime must be provided",
    path: ["responseTime"],
  });

export type TestResult = z.infer<typeof testResultSchema>;
