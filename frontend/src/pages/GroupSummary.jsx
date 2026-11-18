import Card from "../components/Card"
import BalanceChart from "../components/BalanceChart"
import { useEffect, useState } from "react"
import { getMemberBalances } from "../api/apis";
import { useParams } from "react-router";
import GroupInfo from "../components/GroupInfo";
export default function GroupSummary(){
    const {groupId} = useParams();
    const [balances, setBalances] = useState([]);
    async function fetchBalances() {
        const response = await getMemberBalances(groupId);
        setBalances(response.data);
    }
    useEffect(()=>{
        fetchBalances();
    },[])
    return(
        <div className="mx-3">
            <Card>
                <GroupInfo />
                
            </Card>
        </div>
    )
}