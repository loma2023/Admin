let Table = document.querySelector(".Table-body")
function FetchData() {
    let Link = "/ModernSchema.JSON"
    if (Title.includes("بيانات عملاء حماية")) { Link = "/HemayaSchema.JSON" }

    fetch(Link)
        .then((res) => res.json())
        .then((MainData) => { ShowCustomersOrSuppliersData(MainData) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customers Data And Suppliers Data 
function ShowCustomersOrSuppliersData(MainData) {
    Table.innerHTML = ""
    let BalanceMonth = 0.00, BalanceYear = 0.00, TableLength = 0.00

    MainData.sort((A, Z) => new Date(Z.CreatedAt) - new Date(A.CreatedAt))
    MainData.forEach((Customer, index) => {
        let Price = 6000
        if (Customer.Plan === "Month") { BalanceMonth += 300; Price = 300 }
        else if (Customer.Plan === "Year") { BalanceYear += 3000; Price = 3000 }

        TableLength++
        Table.innerHTML += `
        <tr id="${Customer._id}">
                <td>${TableLength}</td>
                <td>${Customer.Username}</td>
                <td>${Customer.Email}</td>
                <td>${Customer.Phone}</td>
                <td>${Customer.Address}</td>
                <td class="Plan ${Customer.Plan}"><div>${Customer.Plan}</div></td>
                <td class="PaymentWay ${Customer.PaymentWay}"><div>${Customer.PaymentWay}</div></td>
                <td>${Price}</td>
                <td>${Customer.ActivedAt.slice(0, 10)}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">تفعيل</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${Customer._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">مراسلة</span>
                            <button type="button" class="btn btn-Message bx bx-envelope" id="${Customer._id}"
                                onclick="FormMessage(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
    });
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".BalanceMonth").innerText = BalanceMonth.toFixed(2)
    document.querySelector(".BalanceYear").innerText = BalanceYear.toFixed(2)
}

// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            Name: Row.querySelectorAll("td")[1].innerText,
            Email: Row.querySelectorAll("td")[2].innerText,
            Phone: Row.querySelectorAll("td")[3].innerText,
            Address: Row.querySelectorAll("td")[4].innerText,
            Plan: Row.querySelectorAll("td")[5].querySelector("div").innerText,
            PaymentWay: Row.querySelectorAll("td")[6].querySelector("div").innerText,
            AmountPlan: Row.querySelectorAll("td")[7].innerText,
            LastActivetion: Row.querySelectorAll("td")[8].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "1997-09-28" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    Table.innerHTML = ""
    let BalanceMonth = 0.00, BalanceYear = 0.00, TableLength = 0.00
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Email") { SearchBy = TableObj.Email }
        if (SearchBy == "Phone") { SearchBy = TableObj.Phone }
        if (SearchBy == "Address") { SearchBy = TableObj.Address }
        if (SearchBy == "Plan") { SearchBy = TableObj.Plan }
        if (SearchBy == "PaymentWay") { SearchBy = TableObj.PaymentWay }

        if (TableObj.LastActivetion >= SDate && TableObj.LastActivetion <= EDate && SearchBy.includes(SearchInput.value)) {
            TableLength++
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${TableLength}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Email}</td>
                <td>${TableObj.Phone}</td>
                <td>${TableObj.Address}</td>
                <td class="Plan ${TableObj.Plan}"><div>${TableObj.Plan}</div></td>
                <td class="PaymentWay ${TableObj.PaymentWay}"><div>${TableObj.PaymentWay}</div></td>
                <td>${TableObj.AmountPlan}</td>
                <td>${TableObj.LastActivetion}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">تفعيل</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${TableObj.ID}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">مراسلة</span>
                            <button type="button" class="btn btn-Message bx bx-envelope" id="${TableObj.ID}"
                                onclick="FormMessage(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            let Price = 6000
            if (TableObj.Plan === "Month") { BalanceMonth += 300; Price = 300 }
            else if (TableObj.Plan === "Year") { BalanceYear += 3000; Price = 3000 }
        }
    })
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".BalanceMonth").innerText = BalanceMonth.toFixed(2)
    document.querySelector(".BalanceYear").innerText = BalanceYear.toFixed(2)
}


// GeneralData => New Collect Or Payment
function NewCollectOrPayment(id) {
    let Form = document.querySelector(".Form-Collect")
    let CustomerID = id
    let Name = Form.querySelector(".Name").innerText;
    let DocDate = Form.querySelector(".DocDate")
    let Total = Form.querySelector(".Total")
    let Plan = Form.querySelector(".Plan")
    let PaymentWay = Form.querySelector(".PaymentWay")

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");
    PaymentWay.classList.remove("Required");

    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }
    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (PaymentWay.value === "Empty") { PaymentWay.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي تحديد طريقة الدفع",); }

    let Link = "/CollectMODERNCustomer"
    if (Title.includes("حماية")) { Link = "/CollectHemayaCustomer" }

    fetch(Link + id, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            DocDate: DocDate.value, Name: Name,
            PaymentWay: PaymentWay.value, Plan: Plan.value, Total: Total.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}

// Function to Set Values in Input 
function FormCollect(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement
    let Form = document.querySelector(".Form-Collect")

    let Plan = parent.querySelectorAll("td")[5].querySelector("div").innerText
    let Options = Form.querySelector(".Plan").querySelectorAll("option")

    Form.classList.toggle("active")
    Form.querySelectorAll("input")[1].focus()
    Form.querySelector(".Name").innerText = parent.querySelectorAll("td")[1].innerText;
    Form.querySelector(".Email").innerText = parent.querySelectorAll("td")[2].innerText;
    Form.querySelector(".Phone").innerText = parent.querySelectorAll("td")[3].innerText
    Form.querySelector(".Address").innerText = parent.querySelectorAll("td")[4].innerText;
    Form.querySelector(".Type-Subscribe").innerText = Plan;
    Form.querySelector(".Type-PaymentWay").innerText = parent.querySelectorAll("td")[6].innerText;
    Form.querySelector(".Amount-Subscribe").innerText = parent.querySelectorAll("td")[7].innerText;
    Form.querySelector(".Last-Subscribe").innerText = parent.querySelectorAll("td")[8].innerText;

    Form.querySelector('.DocDate').value = ToDay
    Form.querySelector('.Total').value = parent.querySelectorAll("td")[7].innerText;
    Form.querySelector('.btn-Save').id = btn.id

    if (Plan === "Month") { Options[1].selected = true }
    if (Plan === "Year") { Options[2].selected = true }
    if (Plan === "Lifetime") { Options[3].selected = true }

}
