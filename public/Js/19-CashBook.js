function FetchData() {
    fetch("/AdminSchema.JSON")
        .then((res) => res.json())
        .then((MainData) => { ShowCashBookData(MainData[0], MainData[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customers Data And Suppliers Data 
function ShowCashBookData(MainData, UserData) {
    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let ThisMonth = new Date().toJSON().slice(0, 7)
    let SumDebitMODERN = 0, SumDebitHemaya = 0, SumDebitThisMonth = 0;
    MainData.GeneralData.sort((A, Z) => new Date(Z.CreatedAt) - new Date(A.CreatedAt))
    MainData.GeneralData.forEach((Receipt, index) => {
        if (Receipt.System === "MODERN") { SumDebitMODERN += Receipt.Total }
        if (Receipt.System === "Hemaya") { SumDebitHemaya += Receipt.Total }
        if (Receipt.DocDate.slice(0, 7) === ThisMonth) { SumDebitThisMonth += Receipt.Total }
        Table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${Receipt.DocDate}</td>
                <td>${Receipt.Name}</td>
                <td>${Receipt.System}</td>
                <td class="Plan fit-contant ${Receipt.Plan}"><div>${Receipt.Plan}</div></td>
                <td class="PaymentWay fit-contant ${Receipt.PaymentWay}"><div>${Receipt.PaymentWay}</div></td>
                <td>${Receipt.Total}</td>
            </tr>`
    })
    document.querySelector(".Buttons-Container .SumDebitMODERN").innerText = SumDebitMODERN
    document.querySelector(".Buttons-Container .SumDebitHemaya").innerText = SumDebitHemaya
    document.querySelector(".Buttons-Container .SumDebitThisMonth").innerText = SumDebitThisMonth
    document.querySelector(".Buttons-Container .SumZakat").innerText = SumDebitThisMonth * 0.25
}
// Function to make Table into array
function CreateArray() {
    let Table = document.querySelector(".Table-body")
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((row) => {
        TableObj = {
            DocDate: row.querySelectorAll("td")[1].innerText,
            Name: row.querySelectorAll("td")[2].innerText,
            System: row.querySelectorAll("td")[3].innerText,
            Plan: row.querySelectorAll("td")[4].innerText,
            PaymentWay: row.querySelectorAll("td")[5].innerText,
            Total: row.querySelectorAll("td")[6].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value
    let Table = document.querySelector(".Table-body")

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "1997-09-28" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    Table.innerHTML = ""
    let SumDebitMODERN = 0, SumDebitHemaya = 0, SumDebitThisMonth = 0;
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "System") { SearchBy = TableObj.System }
        if (SearchBy == "PaymentWay") { SearchBy = TableObj.PaymentWay }

        let index = Table.querySelectorAll("tr")
        if (TableObj.DocDate >= SDate && TableObj.DocDate <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.System}</td>
                <td class="Plan fit-contant ${TableObj.Plan}"><div>${TableObj.Plan}</div></td>
                <td class="PaymentWay fit-contant ${TableObj.PaymentWay}"><div>${TableObj.PaymentWay}</div></td>
                <td>${TableObj.Total}</td>
            </tr>`
            if (TableObj.System === "MODERN") { SumDebitMODERN += TableObj.Total }
            if (TableObj.System === "Hemaya") { SumDebitHemaya += TableObj.Total }
            if (TableObj.DocDate.slice(0, 7) === ThisMonth) { SumDebitThisMonth += TableObj.Total }
        }
    })
    document.querySelector(".Buttons-Container .SumDebitMODERN").innerText = SumDebitMODERN
    document.querySelector(".Buttons-Container .SumDebitHemaya").innerText = SumDebitHemaya
    document.querySelector(".Buttons-Container .SumDebitThisMonth").innerText = SumDebitThisMonth
}