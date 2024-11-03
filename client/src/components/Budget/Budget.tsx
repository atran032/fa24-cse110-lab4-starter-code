import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log(`use effect budget`);
    loadBudget();
    }, []);
  
    const loadBudget = async () => {
      try {
        console.log(`loading budget`);
        const newBudget = await fetchBudget();
        console.log(`budget fetched: ${newBudget}`);
        setBudget(newBudget);
        console.log(`budget now: ${budget}`);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    const handleSetBudget = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newBudget = Number(event.target.value) < 0 ? 0 : Number(event.target.value);
      
      // Update the context immediately to show changes in the UI
      setBudget(newBudget);
    
      // Await the server update and re-set the budget context with the latest data
      try {
        const updatedBudget = await updateBudget(newBudget);
        setBudget(updatedBudget);
      } catch (err) {
        console.error("Failed to update budget on the server:", err);
      }
    };
  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  // Focus the input field automatically when editing mode is enabled


  return (
    <div
      className="alert alert-secondary p-3 d-flex align-items-center justify-content-between"
      onClick={handleClick}>
      {isEditing ? 
        <input
          placeholder="budgetInput"
          type="number"
          value={budget}
          onChange={handleSetBudget}
          onBlur={handleBlur}/> : 
        <div>Budget: ${budget}</div>
      }
    </div>
  );
};

export default Budget;