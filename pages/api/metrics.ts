// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export interface DailyMetric {
  totalSupply: string;
  blockTimestamp: string;
}

export interface FormattedMetric {
  totalSupply: number;
  timestamp: string;
}

const QUERY_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;

const request = async (query: string) => {
  const body = {
    query: query,
  };

  const response = await fetch(QUERY_URL, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  return result;
};

const fetchMetrics = async (range: string): Promise<DailyMetric[]> => {
  const currentTimestamp = Math.round(new Date().getTime() / 1000);

  const r = currentTimestamp - 60 * 60 * 24 * parseInt(range);

  const query = `
    {
      dailyMetrics(first: ${range}, where: {blockTimestamp_gt: ${r}}) {
        totalSupply
        blockTimestamp
      }
    }
  `;

  const {
    data: { dailyMetrics },
  } = await request(query);

  return dailyMetrics;
};

const formatResponse = (data: DailyMetric[]): FormattedMetric[] => {
  return data.map(
    (dailyMetric): FormattedMetric => ({
      ...dailyMetric,
      timestamp: new Date(
        parseInt(dailyMetric.blockTimestamp) * 1000
      ).toISOString(),
      totalSupply: parseFloat(dailyMetric.totalSupply),
    })
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FormattedMetric[]>
) {
  const range = req.query.range as string;

  const dailyMetrics = await fetchMetrics(range);

  const formattedMetrics = formatResponse(dailyMetrics);

  res.status(200).json(formattedMetrics);
}
