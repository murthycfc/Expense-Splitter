import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useNavigate, useParams } from "react-router";
import { getExpenses, getGroup } from "../api/apis";

export default function ViewGroup(){
    const [groupInfo, setGroupInfo] = useState();
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState();
    const {groupId} = useParams();

    const navigate = useNavigate();
    
    async function fetchGroup(groupId) {
        try {
            console.log("aSJadbjaB")
            console.log(localStorage.getItem("token"))
            const data = await getGroup(groupId);
            setGroupInfo(data);
        } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
        }
    }

    async function fetchExpenses(groupId) {
        try {
            console.log("fetch expenses");
            const data = await getExpenses(groupId);
            setExpenses(data.content);
            console.log(data);
        } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
        }
    }
    useEffect(()=>{
       
        fetchGroup(groupId);
        fetchExpenses(groupId);
    },[groupId]);
    return(
        <div className="container mt-4">
            <Card title="Group Details">
                <div>
                    <div className="d-flex flex-column align-items-center">
                        <h3>{groupInfo?.name}</h3>
                        <p className="text-muted">{groupInfo?.description}</p>
                        <div className="d-flex align-items-center gap-1">
                            {groupInfo?.members?.slice(0,2).map(member =>member.name).join(", ")}
                            {groupInfo?.members?.length>2 &&(
                                <span>+{groupInfo.members.length-2} more</span>
                            )}
                        </div>
                    </div>
                    <div>
                        scasss
                        <div className="table-responsive border rounded">
                            <table className="table align-middle table-striped">
                                <colgroup>
                                    <col className="expense-date-col"/>
                                    <col className="expense-description-col"/>
                                    <col className="expense-payer-col"/>
                                    <col className="expense-participants-col"/>
                                </colgroup>
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Title</th>
                                        <th>Payer</th>
                                        <th>Participants</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense)=>(
                                        <tr
                                            key={expense.id}
                                            onClick={()=> navigate()}
                                        >

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}