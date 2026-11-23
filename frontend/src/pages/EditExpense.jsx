import ExpenseCompoent from "../components/ExpenseCompoent";
import Card from "../components/Card";
import BreadCrumb from "../components/Breadcrumb";
import { useParams } from "react-router";
import { Home } from "lucide-react";
export default function EditExpense(){
    const {groupId, expenseId} = useParams();
    return(

        <div className="container m-0 mx-md-5 mt-md-3 mb-md-5">
            <BreadCrumb
                items={[
                    {
                        label:<div className="d-flex align-items-center gap-1"><Home size={16}/>Groups</div>,
                        to:"/"
                    },
                    {
                        label:"View Group",
                        to:`/groups/${groupId}/view`
                    },
                    {
                        label:"view Expense",
                        to:`/expenses/${expenseId}/view`
                    },
                    {
                        label: "Update Expense"
                    }
                ]}
            />
            <Card>
                <ExpenseCompoent isEdit={true} />
            </Card>
            
        </div>
    )
}