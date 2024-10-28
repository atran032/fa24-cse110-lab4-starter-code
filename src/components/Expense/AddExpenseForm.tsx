import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
const AddExpenseForm = () => {
  const context = useContext(AppContext);

  const initialExpense = {
    id: "0",
    name: "",
    cost: 0
  }
  const [newExpense, setNewExpense] = useState(initialExpense);

  const [idCounter, setIdCounter] = useState(1);
  const incrementId = () => {
    setIdCounter(idCounter => idCounter + 1);
  }
  
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewExpense({... newExpense, id: String(idCounter)});
    context.setExpenses([...context.expenses, newExpense])
    console.log(`created expense - id: ${newExpense.id} name: ${newExpense.name} cost: ${newExpense.cost}`);
    incrementId();
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            defaultValue={""}
            onChange={(event) => setNewExpense({... newExpense, name: event.target.value})}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="number"
            className="form-control"
            id="cost"
            defaultValue={0}
            onChange={(event) => setNewExpense({... newExpense, cost: Number(event.target.value) < 0 ? 0 : Number(event.target.value)})}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;
