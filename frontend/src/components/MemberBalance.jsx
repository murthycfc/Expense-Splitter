

export default function MemberBalance({balances}){
    
    return(
        <div className="container mb-4">
            <div className="table-responsive border rounded">
                <table className="table align-middle table-hover">
                    <colgroup>
                        <col style={{width: "5%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "10%"}}/>
                    </colgroup>
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Member</th>
                            <th>Total Paid(₹)</th>
                            <th>Total Share(₹)</th>
                            <th>Net Balance(₹)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    
                    <tbody className="">
                        {balances.map((balance, index)=>(
                            
                                <tr key={balance.id}>
                                    <td className="px-3">{index+1}</td>
                                    <td>{balance.name}</td>
                                    <td>{balance.totalPaid}</td>
                                    <td>{balance.totalShare}</td>
                                    <td className = {`fw-bold ${balance.netBalance>0 ? "text-success"  : balance.netBalance<0 ? "text-danger" : ""}`}>
                                        {balance.netBalance>0 ? `+${balance.netBalance}` : `${balance.netBalance}`}
                                    </td>
                                    <td className={`fw-bold ${
                                        {
                                            RECEIVE: "text-success",
                                            OWES: "text-danger",
                                            SETTLED: "text-primary"
                                        }[balance.status]
                                    } `}>{balance.status}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}