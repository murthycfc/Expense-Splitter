import MemberBalance from "../components/MemberBalance";
import TotalExpenses from "../components/TotalExpenses";
import { useEffect, useState } from "react"
import { getMemberBalances } from "../api/apis";
import BalanceChart from "../components/BalanceChart";
import Card from "../components/Card";

export default function Balances(){
    const [balances, setBalances] = useState([]);
    async function fetchBalances() {
        const data = await getMemberBalances();
        setBalances(data);
    }
    useEffect(()=>{
        fetchBalances();
    },[]);
    return(
        <div className="container my-1">
            <Card title={`Group Summary`} className="row">
                <Card className="col-6 col-sm-4 col-md-2 bg-primary-subtle">
                    {/* <div className=""> */}
                        <TotalExpenses />
                    {/* </div> */}
                    
                </Card>
            </Card>

            <Card title={`Member Balances`} className="mt-4">
                <MemberBalance balances={balances}/>
            </Card>
            
            <Card title={`Net Balance Per Member`} className="mt-4">
                <BalanceChart balances={balances}/>
            </Card>
            
            
        </div>
    )
}