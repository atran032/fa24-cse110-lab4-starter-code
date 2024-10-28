import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import App from "./App";

describe("Expense Creation", () => {
  test("create simple expense", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("new expense")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });
});



describe("Expense Deletion", () => {
    test("delete simple expense", async () => {
      render(<App />);
  
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
      fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
      fireEvent.click(screen.getByText("Save"));

      expect(screen.getByText("new expense")).toBeInTheDocument();
      expect(screen.getByText("$100")).toBeInTheDocument();
  
      const expense = screen.getByTestId(`expense-0`);
      fireEvent.click(within(expense).getByText("x"));
      await waitFor(() => {
        expect(screen.queryByText("new expense")).not.toBeInTheDocument();
        expect(screen.queryByText("$100")).not.toBeInTheDocument();
      });
    });
  });



  describe("Budget Balance Verification", () => {
    test("simple budget verification", () => {
      render(<App />);

      expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
      expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
      expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
      fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
      fireEvent.click(screen.getByText("Save"));

      expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
      expect(screen.getByText("Remaining: $900")).toBeInTheDocument();
      expect(screen.getByText("Spent so far: $100")).toBeInTheDocument();
    });
  });