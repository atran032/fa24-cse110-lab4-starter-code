import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Expense Creation", () => {
  test("create simple expense", () => {
    render(<App />);

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "new expense" } });
    const costInput = screen.getByLabelText("Cost");
    fireEvent.change(costInput, { target: { value: 100 } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("new expense")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });
});