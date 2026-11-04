import { BarChart, ResponsiveContainer,CartesianGrid,XAxis,YAxis,Tooltip,ReferenceLine,Bar,Cell,LabelList } from "recharts";

export default function BalanceChart({balances}){
    const maxBalance = Math.max(
        ...balances.map(person => Math.abs(person.netBalance))
    );

    const range = Math.ceil(maxBalance / 1000) * 1000 + 1000;
    return (
        <div className="container mb-5">
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={balances}

                    >
                        <CartesianGrid strokeDasharray="1" />
                        <XAxis
                            type="category"
                            dataKey="name"
                        />
                        <YAxis
                            type="number"
                            domain={[-range, range]}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        {/* <Tooltip
                            formatter={(value) => `₹${value}`}
                        /> */}
                        <ReferenceLine
                            x={0}
                            stroke="#000"
                        />
                        <Bar
                            dataKey="netBalance"
                            barSize={70}
                        >
                            <LabelList
                                dataKey="netBalance"
                                position="top"
                                className="fw-bold"
                                formatter={(value) => `₹${value}`}
                            />
                            {balances.map((person, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        person.netBalance > 0
                                            ? "#22c55e"
                                            : person.netBalance < 0
                                                ? "#ef4444"
                                                : "#9ca3af"
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>

                </ResponsiveContainer>
            </div>
        </div>
    )
}