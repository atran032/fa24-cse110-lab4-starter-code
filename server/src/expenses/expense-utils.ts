import { Database } from "sqlite3";
import { Expense } from "../types";
import { Request, Response } from "express";

export async function createExpenseServer(req: Request, res: Response, db: Database) {

    try {
        // Type casting the request body to the expected format.
        const { id, cost, description } = req.body as { id: string, cost: number, description: string };
 
        if (!description || !id || !cost) {
            return res.status(400).send({ error: "Missing required fields" });
        }
 
        await db.run('INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);', [id, description, cost]);
        res.status(201).send({ id, description, cost });
 
    } catch (error) {
 
        return res.status(400).send({ error: `Expense could not be created, + ${error}` });
    };
 
 }
 

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    const { id } = req.params; // Extract the ID from request parameters

    // Find the index of the expense with the given ID
    const index = expenses.findIndex(expense => expense.id === id);

    if (index === -1) {
        // If the expense is not found, send a 404 response
        return res.status(404).send({ error: "Expense not found" });
    }

    // Remove the expense from the array
    expenses.splice(index, 1);

    // Send a 204 No Content response to indicate success
    res.status(204).send();
}

export async function getExpenses(req: Request, res: Response, db: Database) {
    
    try {
        // Query all expenses from the database
        const expenses = await new Promise<Expense[]>((resolve, reject) => {
            db.all('SELECT * FROM expenses', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        res.status(200).send({ data: expenses });
    } catch (error) {
        res.status(500).send({ error: `Failed to retrieve expenses: ${error}` });
    }
}