import { useEffect, useState } from "react";
import AddExpense from "../components/AddExpense";
import AddMember from "../components/AddMember";
import History from "../components/History";
import Members from "../components/Members";
import { getAllExpenses, getAllUsers } from "../api/apis";
import Card from "../components/Card";

export default function Home(){
    // const [tempData,setTemptData] = useState([])
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]); 

    async function getUsers(){
        const data = await getAllUsers();
        setMembers(data)
    }
    async function getExpenses() {
        const data = await getAllExpenses();
        setExpenses(data);
    }
    useEffect(()=>{
        getUsers();
        getExpenses();

    },[])

    function handleUserAdded(newUser){
        setMembers(prev =>[
            ...prev,
            newUser
        ]);
    }
    // function handleUserDeleted(deletedUser){
    //     setMembers(prev)}
    return(
        <div className="container mt-4">
            <Card className="mb-4">
                
                <AddMember onUserAdded={handleUserAdded}/>
            </Card>

            <Card className="mb-4" title={`Members (${members.length})`}>
                <Members members={members} fetchUsers={getUsers}/>
            </Card>
            
            <Card className="mb-4">
                <AddExpense onExpenseAdd = {getExpenses}/>
            </Card>
            
            <Card className="mb-4" title={`Expense History (${expenses.length})`}>
                <History expenses={expenses} fetchExpenses={getExpenses}/>
            </Card>
            
        </div>
    )
}