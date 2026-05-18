let transactions = []

let chart

// USERNAME

let username =
localStorage.getItem("username")

document.getElementById("welcomeText")
.innerText = `Hello ${username} 👋`

// LOAD THEME

let savedTheme =
localStorage.getItem("theme")

if(savedTheme=="dark")
{
    document.body.classList.add("dark")
}

// LOAD DATA

loadTransactions()

// ADD TRANSACTION

function addTransaction()
{
    let title =
    document.getElementById("title").value

    let amount =
    document.getElementById("amount").value

    let date =
    document.getElementById("date").value

    let type =
    document.getElementById("type").value

    if(title=="" || amount=="" || date=="")
    {
        alert("Please fill all fields")
        return
    }

    let category =
    autoCategory(title)

    let transaction = {

        title,

        amount:parseInt(amount),

        date,

        type,

        category
    }

    transactions.push(transaction)

    saveTransactions()

    renderTransactions()

    updateSummary()

    renderChart()

    aiSuggestion()

    clearInputs()
}

// AUTO CATEGORY

function autoCategory(title)
{
    title = title.toLowerCase().trim()

    if(
        title.includes("food") ||
        title.includes("pizza") ||
        title.includes("burger") ||
        title.includes("restaurant") ||
        title.includes("dominos") ||
        title.includes("kfc") ||
        title.includes("swiggy") ||
        title.includes("zomato")
    )
    {
        return "Food 🍔"
    }

    else if(
        title.includes("uber") ||
        title.includes("ola") ||
        title.includes("bus") ||
        title.includes("train") ||
        title.includes("flight") ||
        title.includes("petrol")
    )
    {
        return "Travel 🚗"
    }

    else if(
        title.includes("amazon") ||
        title.includes("flipkart") ||
        title.includes("shopping") ||
        title.includes("clothes")
    )
    {
        return "Shopping 🛒"
    }

    else if(
        title.includes("movie") ||
        title.includes("netflix") ||
        title.includes("game")
    )
    {
        return "Entertainment 🎮"
    }

    else if(
        title.includes("salary") ||
        title.includes("freelance") ||
        title.includes("payment")
    )
    {
        return "Income 💰"
    }

    return "Other 📦"
}

// RENDER TABLE

function renderTransactions(filteredData = transactions)
{
    let tableBody =
    document.getElementById("tableBody")

    tableBody.innerHTML = ""

    if(filteredData.length==0)
    {
        tableBody.innerHTML =
        `
        <tr>

            <td colspan="6"
            class="text-center p-4">

            No Transactions Found

            </td>

        </tr>
        `

        return
    }

    filteredData.forEach((transaction,index)=>{

        tableBody.innerHTML += `

        <tr>

            <td>${transaction.title}</td>

            <td>
            ₹${transaction.amount.toLocaleString()}
            </td>

            <td>${transaction.category}</td>

            <td>${transaction.type}</td>

            <td>${formatDate(transaction.date)}</td>

            <td>

                <button
                class="btn btn-danger"
                onclick="deleteTransaction(${index})">

                🗑️

                </button>

            </td>

        </tr>
        `
    })
}

// UPDATE SUMMARY

function updateSummary()
{
    let income = 0

    let expense = 0

    transactions.forEach((transaction)=>{

        if(transaction.type=="income")
        {
            income += transaction.amount
        }
        else
        {
            expense += transaction.amount
        }

    })

    document.getElementById("income")
    .innerText =
    `₹${income.toLocaleString()}`

    document.getElementById("expense")
    .innerText =
    `₹${expense.toLocaleString()}`

    document.getElementById("balance")
    .innerText =
    `₹${(income-expense).toLocaleString()}`
}

// CHART

function renderChart()
{
    let income = 0

    let expense = 0

    transactions.forEach((transaction)=>{

        if(transaction.type=="income")
        {
            income += transaction.amount
        }
        else
        {
            expense += transaction.amount
        }

    })

    let balance = income-expense

    let ctx =
    document.getElementById("expenseChart")

    if(chart)
    {
        chart.destroy()
    }

    chart = new Chart(ctx, {

        type:"pie",

        data:{

            labels:[
                "Income",
                "Expense",
                "Balance"
            ],

            datasets:[{

                data:[
                    income,
                    expense,
                    balance
                ]

            }]
        }
    })
}

// DELETE

function deleteTransaction(index)
{
    transactions.splice(index,1)

    saveTransactions()

    renderTransactions()

    updateSummary()

    renderChart()

    aiSuggestion()
}

// SAVE

function saveTransactions()
{
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    )
}

// LOAD

function loadTransactions()
{
    let data =
    JSON.parse(localStorage.getItem("transactions"))

    if(data)
    {
        transactions = data
    }

    renderTransactions()

    updateSummary()

    renderChart()

    aiSuggestion()
}

// CLEAR INPUTS

function clearInputs()
{
    document.getElementById("title").value=""

    document.getElementById("amount").value=""

    document.getElementById("date").value=""
}

// DARK MODE

function darkMode()
{
    document.body.classList.toggle("dark")

    if(document.body.classList.contains("dark"))
    {
        localStorage.setItem("theme","dark")
    }
    else
    {
        localStorage.setItem("theme","light")
    }
}

// AI SUGGESTIONS

function aiSuggestion()
{
    let income = 0

    let expense = 0

    transactions.forEach((transaction)=>{

        if(transaction.type=="income")
        {
            income += transaction.amount
        }
        else
        {
            expense += transaction.amount
        }

    })

    let aiBox =
    document.getElementById("aiBox")

    let balance = income-expense

    if(income==0 && expense==0)
    {
        aiBox.innerText =
        "AI Suggestion: Start adding your transactions."
    }

    else if(expense > income)
    {
        aiBox.innerText =
        "⚠️ AI Alert: Your expenses exceeded your income."
    }

    else if(balance < 1000)
    {
        aiBox.innerText =
        "⚠️ AI Alert: Your remaining balance is very low."
    }

    else if(expense > income*0.7)
    {
        aiBox.innerText =
        "📈 AI Insight: Your spending is increasing rapidly."
    }

    else if(balance > 10000)
    {
        aiBox.innerText =
        "🎉 AI Insight: Great savings this month!"
    }

    else
    {
        aiBox.innerText =
        "✅ AI Suggestion: Your financial health looks good."
    }
}

// FILTER + SEARCH

function filterTransactions()
{
    let filterValue =
    document.getElementById("filterType").value

    let searchValue =
    document.getElementById("searchInput")
    .value
    .toLowerCase()

    let filteredData = transactions.filter((transaction)=>{

        let matchesType =
        filterValue=="all" ||
        transaction.type==filterValue

        let matchesSearch =

        transaction.title
        .toLowerCase()
        .includes(searchValue)

        ||

        transaction.category
        .toLowerCase()
        .includes(searchValue)

        return matchesType && matchesSearch
    })

    renderTransactions(filteredData)
}

// DATE FORMAT

function formatDate(dateString)
{
    let options = {

        day:"numeric",

        month:"short",

        year:"numeric"
    }

    return new Date(dateString)
    .toLocaleDateString("en-IN",options)
}