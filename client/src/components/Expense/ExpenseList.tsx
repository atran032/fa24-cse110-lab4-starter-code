import ExpenseItem from "./ExpenseItem";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect } from "react";
import { Expense } from "../../types/types";
import { fetchExpenses } from "../../utils/expense-utils";

const ExpenseList = () => {
  const { expenses } = useContext(AppContext);

  // Fetch expenses on component mount
  useEffect(() => {
    loadExpenses();
    }, []);
  
    // Function to load expenses and handle errors
    const loadExpenses = async () => {
    try {
      const expenseList = await fetchExpenses();
      fetchExpenses(expenseList);
    } catch (err: any) {
      console.log(err.message);
    }
    };

  return (
    <ul className="list-group">
      {expenses.map((expense: Expense) => (
        <ExpenseItem key={expense.id} id={expense.id} name={expense.name} cost={expense.cost} />
      ))}
    </ul>
  );
};

export default ExpenseList;
