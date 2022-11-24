import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedMetric } from '../pages/api/metrics';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<FormattedMetric[]>([])

  const fetchMetrics = async () => {
    const resp = await fetch('/api/metrics', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    const dailyMetrics: FormattedMetric[] = await resp.json()

    setMetrics(dailyMetrics)
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        <h1>Total Supply</h1>
        <ResponsiveContainer height={500}>
          <LineChart
            data={metrics}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" angle={30} hide />
            <YAxis hide />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSupply" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

      </Col>
    </Row>
  )
}