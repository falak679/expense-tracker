let expenseChart;
async function loadExpenses() {

    const response =
        await fetch("/expenses");

    const expenses =
        await response.json();

    expenseList.innerHTML = "";

    let total = 0;

    let categoryTotals = {};

    expenses.forEach(function(expense) {

        const li =
         document.createElement("li");
         li.classList.add("expense-item");

         li.innerHTML =
             "[" + expense.category + "] " +
             expense.name +
             " - ₹" +
             expense.amount +
             "<br>📅 " +
             expense.date;

        const editButton =
          document.createElement("button");

        editButton.textContent = "✏️";
        
        editButton.addEventListener(
           "click",
            async function(){
               const newName =
                     prompt(
                         "Enter new name:",
                          expense.name
                        );

                const newAmount =
                        prompt(
                          "Enter new amount:",
                           expense.amount
                        ); 
                await fetch(
                       `/expenses/${expense.id}`,
                         {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                 "application/json"
                            },

                            body: JSON.stringify({

                                 name: newName,

                                 amount:
                                 Number(newAmount),

                                 category:
                                 expense.category,

                                 date:
                                 expense.date

                            })

                         }
                );

                    await loadExpenses();           
            }
        );
        
        const deleteButton =
          document.createElement("button");

        deleteButton.textContent = "🗑️";

        deleteButton.addEventListener(
        "click",
         async function() {

             await fetch(
              `/expenses/${expense.id}`,
               {
                method: "DELETE"
               }
              );

              await loadExpenses();

            }
        );
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        expenseList.appendChild(li);

        total = total + expense.amount;

        if(categoryTotals[expense.category]){

             categoryTotals[expense.category] += expense.amount;

        }
        else{

             categoryTotals[expense.category] = expense.amount;

        }

    });

    document.getElementById("total").textContent = total;
    const categorySummary =
         document.getElementById("categorySummary");

    categorySummary.innerHTML = "";

    for(const category in categoryTotals){

        const li =
           document.createElement("li");

        li.textContent =
           category +
           ": ₹" +
           categoryTotals[category];

        categorySummary.appendChild(li);

    }
    const labels =
        Object.keys(categoryTotals);

    const amounts =
        Object.values(categoryTotals);

    if(expenseChart){
       expenseChart.destroy();
    }
    
    const ctx =
        document.getElementById("expenseChart");

    expenseChart = new Chart(ctx, {

       type: "pie",

       data: {

           labels: labels,

           datasets: [{
              data: amounts
           }]

        }

    });
    
}

const button=document.getElementById("addButton");
const expenseList=document.getElementById("expenseList");
button.addEventListener("click", async function(){
    const expenseName=document.getElementById("expenseName").value;
    const expenseAmount=document.getElementById("expenseAmount").value;
    const expenseCategory =document.getElementById("expenseCategory").value;
    const expenseDate =document.getElementById("expenseDate").value;
    if(!expenseName || !expenseAmount || !expenseDate){
        alert("Please enter all fields");
        return;
    }

    await fetch("/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          name: expenseName,
          amount: Number(expenseAmount),
          category: expenseCategory,
          date: expenseDate
      })
    });
    
    await loadExpenses();

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    
});
loadExpenses();

