import Card from "../components/Card";
import ExpenseCompoent from "../components/ExpenseCompoent";

export default function CreateExpense(){
    return(
        <div className="m-0 m-md-5">
            
            <Card>
                <ExpenseCompoent  isEdit={false} />
            </Card>
            
        </div>
    )
}