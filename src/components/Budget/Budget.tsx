import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Reference for input field

  const handleSetBudget = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(Number(event.target.value) < 0 ? 0 : Number(event.target.value));
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