import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from "xlsx";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
}

const FilePath = path.join(__dirname, "expenses.xslsx");


function loadExpenses(): Expense[] {
    if (!fs.existsSync(FilePath)) {
    return [];
    }
    const workbook = XLSX.readFile(FilePath);
    const sheetName = workbook.SheetNames[0];
    const data: Expense[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return data.map(e => ({
    ...e,
    date: new Date(e.date) // convertir fecha
    }));
}

let expenses: Expense[] = loadExpenses();


function saveExpenses() {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, FilePath);
}
function CreateExpenses(description, ammount) {
    const NewExpense: Expense = {
        id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
        description,
        amount: ammount,
        date: new Date(),
    };
    expenses.push(NewExpense);
    saveExpenses();
    console.log("\n✅ Expense created!\n");
}
function ListExpenses() {
  if (expenses.length === 0) {
    console.log("\n❌ No expenses found.\n");
    return;
  }
  expenses.forEach((expense) => {
    console.log(`\nID: ${expense.id}\nDescription: ${expense.description}\nAmount: ${expense.amount}\nDate: ${expense.date}\n`);
  });
}
function DeleteExpenses(id: number) {
    const initialLength = expenses.length;
    expenses = expenses.filter((t) => t.id !== id);
    if (expenses.length < initialLength) {
      saveExpenses();
      console.log("\n🗑 Task deleted!\n");
    } else {
      console.log("\n❌ Task not found.\n");
    }
  }

function SummarizeExpenses(month?: number) {
    let Summary = expenses
    if (month !== undefined) {
        summary = expenses.filter(e => e.edate.getMonth() === month -1)
    }

    
}

function main() {
    const args = process.argv.slice(2)
    const command = args[0];
    const param1 = args[1]
    const param2 = args[2]

    switch(command) {
        case "create":
            if (!param1) { console.log("❌ Debes ingresar una descripción."); return; }
            if (!param2) { console.log("❌ Debes ingresar una descripción."); return; }
            CreateExpenses(param1, param2);
            break;

        case "delete":
            if (!param1) { console.log("❌ Debes ingresar un ID."); return; }
            DeleteExpenses(parseInt(param1));
            break;
            
        case "list":
            if(!param1) {ListExpenses(); return;}
            break;

         case "summary":
            if(!param1) {SummarizeExpenses(); return;}
            SummarizeExpenses(parseInt(param1))
            break;
            
    }
}
main();