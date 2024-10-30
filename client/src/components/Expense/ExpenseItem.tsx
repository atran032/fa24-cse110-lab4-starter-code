import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";

const ExpenseItem = (currentExpense: Expense) => {
  const context = useContext(AppContext);

  const handleDeleteExpense = (currentExpense: Expense) => {
    context.setExpenses(context.expenses.filter((Expense) => Expense.id !== currentExpense.id));
  };

  return (
    <li data-testid={`expense-${currentExpense.id}`} className="list-group-item d-flex justify-content-between align-items-center" >
      <div>{currentExpense.description}</div>
      <div>${currentExpense.cost}</div>
      <div>
        <button onClick={() => handleDeleteExpense(currentExpense)}>x</button>
      </div>
    </li>
  );
};

export default ExpenseItem;
