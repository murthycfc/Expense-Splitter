import { useEffect, useState } from "react";
import Card from "../components/Card"
import SummaryCard from "./SummaryCard"
import { useParams } from "react-router";
import { getMembers, getTotalExpenses } from "../api/apis";
import { Users, Wallet } from "lucide-react";
export default function GroupInfo(){
    const {groupId} = useParams();
    const [totalExpenseAmount, setTotalExpenseAmount] = useState();
    const [members, setMembers] = useState([]);
    async function fetchTotalExpenses(groupId) {
        try {
            const response = await getTotalExpenses(groupId);
            setTotalExpenseAmount(response.data);
            console.log(response.data)
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }
    async function fetchMembers(groupId) {
            try {
                console.log("fetch members")
                const data = await getMembers(groupId);
                setMembers(data);
                console.log("members", {data})
            } catch (error) {
                setErrors({server: error?.response?.data?.message})
            }
        }
    useEffect(()=>{
        fetchTotalExpenses(groupId)
        fetchMembers(groupId)
    },[groupId])
    return(
        <div>
            <Card className="mt-3" title="Group Summary" >
                <div className="row g-3">
                    <div className="col-12 col-sm-6 col-lg-4">
                        <SummaryCard 
                            title="Total Amount"
                            value={`₹${totalExpenseAmount}`}
                            description="Total amount spent in this group"
                            icon={<Wallet />}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <SummaryCard 
                            title="Total Members"
                            value={members.length}
                            description="Group participants"
                            icon={<Users />}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <SummaryCard 
                            title="Total Expenses"
                            value={expenses.length}
                            description="Recorded transactions"
                            icon={<ReceiptPoundSterling />}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <SummaryCard 
                            title="Total Paid"
                            value={
                                <div>
                                    <span>₹</span>
                                    <span>{memberBalances.find(memberBalance =>
                                memberBalance.userId===localStorage.getItem("id")
                                )?.totalPaid ?? 0}</span>
                                </div>
                            }
                            valueColor ="text-success"
                            description="Total amount you've paid in this group"
                            icon={<ReceiptPoundSterling />}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <SummaryCard 
                            title="Your Share"
                            value={
                                <div>
                                    <span>₹</span>
                                    <span>{memberBalances.find(memberBalance =>
                                        memberBalance.userId===localStorage.getItem("id")
                                        )?.totalShare ?? 0}</span>
                                </div>}
                            valueColor ="text-danger"
                            description="Your total share of the group expenses"
                            icon={<ReceiptPoundSterling />}
                        />
                    </div>
                </div>
            </Card>
        </div>

    )
}