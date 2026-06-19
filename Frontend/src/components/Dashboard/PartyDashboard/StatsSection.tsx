import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, type ChartTooltipProps } from '../../../utils/util';

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-4 shadow-xl">
          <p className="font-bold gradient-text font-display">{`${label}`}</p>
          <p className="text-white/80">
            <span className="font-semibold">Votes:</span> {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
};
type PartyData = {
    label : string;
    value : number;
    color : string;
}
const COLORS = [
    '#4C51BF', '#6B46C1', '#805AD5', '#B794F4', '#553C9A',
    '#2B6CB0', '#3182CE', '#4299E1', '#63B3ED', '#2C5282',
    '#2C7A7B', '#38B2AC', '#4FD1C5', '#81E6D9', '#234E52',
    '#2F855A', '#38A169', '#48BB78', '#9AE6B4', '#22543D',
    '#9C4221', '#C05621', '#DD6B20', '#ED8936', '#7B341E',
    '#742A2A', '#9B2C2C', '#C53030', '#E53E3E', '#742A2A'
  ];
export default function StatsSection () {
    const [ ids, setIds] = useState([]);
    const [ partyData, setPartyData] = useState<PartyData[]>([]);
    useEffect(() => {
        const getPartyIds = async () => {
            try {
              const response = await axios.get(`${API_URL}/api/v2/getPartiesId`);
              if (response.data?.partyIds) {
                setIds(response.data.partyIds);
              }
            } catch (error) {
              console.log(error);
            }
          };
          getPartyIds();
    },[]);

    const getFunction = async (partyId: string) => {
      try {
        const response = await axios.get(`${API_URL}/api/v3/partyStatus`, {
          params: { partyId },
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching party ${partyId}:`, error);
        return null;
      }
    };

    
    useEffect(() => {
        if (ids.length === 0) return;

    const getPartyData = async () => {
      try {
        const requests = ids.map((party) => getFunction(party));
      const results = await Promise.all(requests);
      const validData = results
        .map((res, index) => ({
          label: res.name,
          value: res.voteCount,
          color: COLORS[index % COLORS.length],
        }));
      setPartyData(validData);
      } catch (error) {
        console.log(error);
      }
    };
    getPartyData();
    },[ids])
    return(
        
        <div className="glass gradient-border p-6 rounded-3xl h-full">
      <h2 className="text-xl font-bold font-display mb-4 text-white flex items-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
          <BarChart2 size={18} />
        </span>
        Current Votes Stats
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={partyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
            barSize={40}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-white/70">{value}</span>}
            />
            <Bar 
              dataKey="value" 
              name="Value" 
              radius={[4, 4, 0, 0]}
            >
              {partyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Bar>
            <defs>
              <filter id="shadow" x="-2" y="0" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
              </filter>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    )
}