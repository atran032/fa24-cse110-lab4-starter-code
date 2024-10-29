import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import App from "./App";

test("render", async () => {
  render(<App />);

  expect(screen.queryByTestId(`expense-0`)).toBeInTheDocument();
  expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
});

describe("Expense Creation", () => {
  test("create simple expense", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
    fireEvent.click(screen.getByText("Save"));

    expect(within(screen.getByTestId(`expense-0`)).getByText("new expense")).toBeInTheDocument();
    expect(within(screen.getByTestId(`expense-0`)).getByText("$100")).toBeInTheDocument();
  });

  test("create zero cost expense", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 0 } });
    fireEvent.click(screen.getByText("Save"));

    expect(within(screen.getByTestId(`expense-0`)).getByText("new expense")).toBeInTheDocument();
    expect(within(screen.getByTestId(`expense-0`)).getByText("$0")).toBeInTheDocument();
  });

  test("create negative cost expense", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: -100 } });
    fireEvent.click(screen.getByText("Save"));

    expect(within(screen.getByTestId(`expense-0`)).getByText("new expense")).toBeInTheDocument();
    expect(within(screen.getByTestId(`expense-0`)).getByText("$0")).toBeInTheDocument();
  });

  test("create high cost expense", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 2000 } });
    fireEvent.click(screen.getByText("Save"));

    expect(within(screen.getByTestId(`expense-0`)).getByText("new expense")).toBeInTheDocument();
    expect(within(screen.getByTestId(`expense-0`)).getByText("$2000")).toBeInTheDocument();
  });

    test("create no field expense", async () => {
    render(<App />);

    fireEvent.click(screen.getByText("Save"));
    
    await waitFor(() => {
      expect(screen.queryByTestId(`expense-0`)).not.toBeInTheDocument();
    })
  });
});



describe("Expense Deletion", () => {
  test("delete simple expense", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
    fireEvent.click(screen.getByText("Save"));

    fireEvent.click(within(screen.getByTestId(`expense-0`)).getByText("x"));
    await waitFor(() => {
      expect(screen.queryByText("new expense")).not.toBeInTheDocument();
      expect(screen.queryByText("$100")).not.toBeInTheDocument();
    });
  });

  test("delete more expenses", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });
    fireEvent.click(screen.getByText("Save"));
    fireEvent.click(screen.getByText("Save"));
    fireEvent.click(screen.getByText("Save"));

    const testCases = [0, 1, 2];
    for (let i = 0; i < testCases.length; i++) {
      fireEvent.click(within(screen.getByTestId(`expense-${testCases[i]}`)).getByText("x"));
      await waitFor(() => {
        expect(screen.queryByTestId(`expense-${testCases[i]}`)).not.toBeInTheDocument();
      });
    };
  });

  test("create then delete expenses", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });

    const testCases = [0, 1, 2];
    for (let i = 0; i < testCases.length; i++) {
      fireEvent.click(screen.getByText("Save"));
      expect(screen.queryByTestId(`expense-${testCases[i]}`)).toBeInTheDocument();
      fireEvent.click(within(screen.getByTestId(`expense-${testCases[i]}`)).getByText("x"));
      await waitFor(() => {
        expect(screen.queryByTestId(`expense-${testCases[i]}`)).not.toBeInTheDocument();
      });
    };
  });

  test("delete even more expenses", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100 } });

    const testCases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < testCases.length; i++) {
      fireEvent.click(screen.getByText("Save"));
    };

    for (let i = 0; i < testCases.length; i++) {
      fireEvent.click(within(screen.getByTestId(`expense-${testCases[i]}`)).getByText("x"));
      await waitFor(() => {
        expect(screen.queryByTestId(`expense-${testCases[i]}`)).not.toBeInTheDocument();
      });
    };
  });
});



describe("Budget Balance Verification", () => {
  test("simple verification", () => {
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

  test("zero cost verification", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 0 } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  });

  test("negative cost verification", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: -100 } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  });

  test("high cost verification", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 2000 } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Budget: $1000")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $-1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $2000")).toBeInTheDocument();
  });

  test("budget increase verification", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Budget: $1000"));
    fireEvent.input(screen.getByPlaceholderText("budgetInput"), { target : { value : 1500 }});
    fireEvent.blur(screen.getByPlaceholderText("budgetInput"));

    expect(screen.getByText("Budget: $1500")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $1500")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  });

  test("budget decrease verification", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Budget: $1000"));
    fireEvent.input(screen.getByPlaceholderText("budgetInput"), { target : { value : 500 }});
    fireEvent.blur(screen.getByPlaceholderText("budgetInput"));

    expect(screen.getByText("Budget: $500")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $500")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  });

  test("budget negative verification", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Budget: $1000"));
    fireEvent.input(screen.getByPlaceholderText("budgetInput"), { target : { value : -500 }});
    fireEvent.blur(screen.getByPlaceholderText("budgetInput"));

    expect(screen.getByText("Budget: $0")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $0")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  });

  test("budget equal cost verification", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 500 } });
    fireEvent.click(screen.getByText("Save"));

    fireEvent.click(screen.getByText("Budget: $1000"));
    fireEvent.input(screen.getByPlaceholderText("budgetInput"), { target : { value : 500 }});
    fireEvent.blur(screen.getByPlaceholderText("budgetInput"));

    expect(screen.getByText("Budget: $500")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $0")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $500")).toBeInTheDocument();
  });

  test("budget less than cost verification", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "new expense" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 500 } });
    fireEvent.click(screen.getByText("Save"));

    fireEvent.click(screen.getByText("Budget: $1000"));
    fireEvent.input(screen.getByPlaceholderText("budgetInput"), { target : { value : 300 }});
    fireEvent.blur(screen.getByPlaceholderText("budgetInput"));

    expect(screen.getByText("Budget: $300")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $-200")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $500")).toBeInTheDocument();
  });
});