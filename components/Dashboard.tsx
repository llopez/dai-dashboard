import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedMetric } from '../pages/api/metrics';
import { RangeSelector } from './RangeSelector';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<FormattedMetric[]>([])

  const fetchMetrics = async (range: number) => {
    const resp = await fetch('/api/metrics?range=' + range.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    const dailyMetrics: FormattedMetric[] = await resp.json()

    setMetrics(dailyMetrics)
  }

  useEffect(() => {
    fetchMetrics(30)
  }, [])

  return (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        <h1>Total Supply</h1>
        <RangeSelector defaultValue={30} onChange={(range) => { fetchMetrics(range) }} />
        <ResponsiveContainer height={500}>
          <LineChart
            data={metrics}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSupply" stroke="#8884d8" activeDot={{ r: 4 }} dot={false} />
          </LineChart>
        </ResponsiveContainer>

      </Col>
    </Row>
  )
}