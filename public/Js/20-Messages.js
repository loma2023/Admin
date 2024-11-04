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

    let TableLength = 0;
    MainData.MessagesData.forEach((Receipt, index) => {
        Table.innerHTML += `
            <tr id="${Receipt._id}">
                <td>${index + 1}</td>
                <td>${Receipt.Name}</td>
                <td>${Receipt.Email}</td>
                <td>${Receipt.Message}</td>
                <td>${Receipt.System}</td>
                <td>${Receipt.CreatedAt.slice(0, 10)}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">مراسلة</span>
                            <button type="button" class="btn btn-Message bx bx-envelope" id="${Receipt._id}"
                                onclick="FormMessage(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">حذف</span>
                            <button type="button" onclick="Show_Alert(id)" id="${Receipt._id}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        TableLength++
    })
    document.querySelector(".Buttons-Container .TableLength").innerText = TableLength
}
// Function to make Table into array
function CreateArray() {
    let Table = document.querySelector(".Table-body")
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            Name: Row.querySelectorAll("td")[1].innerText,
            Email: Row.querySelectorAll("td")[2].innerText,
            Message: Row.querySelectorAll("td")[3].innerText,
            System: Row.querySelectorAll("td")[4].innerText,
            CreatedAt: Row.querySelectorAll("td")[5].innerText,
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
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Email") { SearchBy = TableObj.Email }

        let index = Table.querySelectorAll("tr")
        if (TableObj.CreatedAt >= SDate && TableObj.CreatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Email}</td>
                <td>${TableObj.Message}</td>
                <td>${TableObj.System}</td>
                <td>${TableObj.CreatedAt}</td>
                <td>
                    <div class="FlexTD">
                       <div class="btn-box">
                            <span class="tooltip">مراسلة</span>
                            <button type="button" class="btn btn-Message bx bx-envelope" id="${TableObj.ID}"
                                onclick="FormMessage(event)">
                            </button>
                        </div>
                         <div class="btn-box">
                            <span class="tooltip">حذف</span>
                            <button type="button" onclick="Show_Alert(id)" id="${TableObj.ID}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        }
    })
}

// Function to Delete Customer Or Supplier
function DeleteData(id) {
    fetch("/Messages" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}


