import { BarChart, ResponsiveContainer,CartesianGrid,XAxis,YAxis,Tooltip,ReferenceLine,Bar,Cell,LabelList } from "recharts";

export default function BalanceChart({balances}){
    const maxBalance = Math.max(
        ...balances.map(person => Math.abs(person.netBalance))
    );

    const range = Math.ceil(maxBalance / 1000) * 1000;
    // const range = maxBalance + 1000;
    return (
        <div className="container mb-5">
            <div className="d-flex flex-md-column align-items-end gap-1 gap-md-3 mb-3">
                <div className="d-flex  align-items-center gap-2" style={{width: "110px"}}>
                    <span className="legend-box" style={{backgroundColor:"#22c55e"}}></span>
                    <small className="fw-semibold">RECEIVE</small>
                </div>
                <div className="d-flex align-items-center gap-2" style={{width: "110px"}}>
                    <span className="legend-box" style={{backgroundColor:"#ef4444"}}></span>
                    <small className="fw-semibold">OWES</small>
                </div>

                <div className="d-flex align-items-center gap-2" style={{width: "110px"}}>
                    <span className="legend-box" style={{backgroundColor:"#9ca3af"}}></span>
                    <small className="fw-semibold">SETTLED</small>
                </div>
            </div>
            <div className="balance-chart-container">
                <div
                    className="balance-chart-inner"
                    style={{
                        width: `${Math.max(balances.length * 85, 800)}px`,
                        height: "380px",
                    }}
                >

                
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={balances}
                            margin={{
                                top: 20,
                                right: 10,
                                left: 10,
                                bottom: 20
                            }}
                        >
                            <CartesianGrid strokeDasharray="1" />
                            <XAxis
                                type="category"
                                dataKey="name"
                                interval={0}
                                angle={-35}
                                textAnchor="start"
                                height={75}
                                tick={{
                                    fontWeight: 700,
                                    fontSize: 12,
                                    fill: "#34303A"
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={[-range, range]}
                                tickFormatter={(value) => `₹${value}`}
                                width={65}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                formatter={(value) => `₹${value}`}
                            />
                            <ReferenceLine
                                y={0}
                                stroke="#000"
                            />
                            <Bar
                                dataKey="netBalance"
                                maxBarSize={45}
                            >
                                <LabelList
                                    dataKey="netBalance"
                                    position="top"
                                    className="fw-bold"
                                    formatter={(value) => `₹${value}`}
                                    fontSize={11}
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
        </div>
    )
}