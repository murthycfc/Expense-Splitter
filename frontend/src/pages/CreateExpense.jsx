import { useParams } from "react-router";
import BreadCrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import ExpenseCompoent from "../components/ExpenseCompoent";
import { Home } from "lucide-react";

export default function CreateExpense(){
    const {groupId} = useParams();
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
                        label: "Create Expense"
                    }
                ]}
            />
            
            <Card>
                <ExpenseCompoent  isEdit={false} />
            </Card>
            
        </div>
    )
}