let User, Timetxt = "";
function FetchNotificationsData() {
    fetch("/AdminSchema.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowNotificationsData(Data[0], Data[1]) })
        .catch((err) => { return location.href = "/Error" })
} FetchNotificationsData()
setInterval(() => { FetchNotificationsData() }, 5000);

function ShowNotificationsData(MainData, Decode) {
    User = Decode;
    let NotificatItems = document.querySelector(".Notificat-items")
    let NumNot = 0
    if (MainData.NotificationsData.length > 0) { NotificatItems.innerHTML = "" }
    MainData.NotificationsData.sort((A, Z) => new Date(Z.CreatedAt) - new Date(A.CreatedAt))
    MainData.NotificationsData.forEach(Notification => {
        let Username = '', ImgSrc = "avatar", StatusRead = "UnRead"
        if (Notification.Username === User.UserID) { Username = "لقد قمت" }
        else { Username = Notification.Username }

        TimeSince(Notification.CreatedAt)
        let Reader = Notification.ReadBy.find(Obj => Obj.User === User.UserID)
        if (Reader) { StatusRead = "Read" } else { NumNot++ }

        NotificatItems.innerHTML += `
                    <div class="item ${StatusRead}" id="${Notification._id}">
                        <div class="right">
                            <div class="${ImgSrc}"><img src="Img/${ImgSrc}.png" alt="" srcset=""></div>
                            <i class='bx ${Notification.Icon}'></i>
                        </div>
                        <div class="left">
                            <div>
                                <h4 class="${Username}">${Username}</h4>
                                <span><i class="bx bx-time-five"></i> ${Timetxt}</span>
                            </div>
                            <p> ${Notification.Text} </p>
                        </div>
                    </div> `
    });
    document.querySelector(".num-not").innerText = NumNot
    if (NumNot > 0) { document.querySelector(".num-not").style.display = "flex" }
    ReadNotification()
    // هنا هنعرض بيانات المحل
    document.querySelector(".Details-Company .NameCompany").innerText = MainData.NameCompany
    document.querySelector(".Details-Company .TypeCompany").innerText = MainData.TypeCompany
    let line1 = " - ", line2 = " - ";
    if (MainData.CityCompany === "" || MainData.AddressCompany === "") { line1 = "" }
    document.querySelector(".Details-Company .AddressCompany span").innerText = MainData.CityCompany + line1 + MainData.AddressCompany
    if (MainData.PhoneCompany1 === "" || MainData.PhoneCompany2 === "") { line2 = "" }
    document.querySelector(".Details-Company .PhoneCompany span").innerText = MainData.PhoneCompany1 + line2 + MainData.PhoneCompany2

    if (MainData.LogoCompany != "") { document.querySelector(".Details-Company .Logo").src = MainData.LogoCompany }
    else { document.querySelector(".Details-Company .Logo").src = "Img/Logo2.png" }

}

function TimeSince(MyDate) {
    Timetxt = ""

    var seconds = Math.floor((new Date() - new Date(MyDate)) / 1000);

    var interval = seconds / 31536000; // الاعوام
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أعوام"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " عام"; }

    interval = seconds / 2592000; // الاشهر
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أشهر"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " شهر"; }

    interval = (seconds / 86400) / 7; // اسابيع
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أسابيع"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " أسبوع"; }

    interval = seconds / 86400; // الايام
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " أيام"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " يوم"; }

    interval = seconds / 3600; // الساعات
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " ساعات"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " ساعة"; }

    interval = seconds / 60; // الدقائق
    if (interval >= 3 && interval <= 10) { return Timetxt = "منذ " + Math.floor(interval) + " دقائق"; }
    if (interval >= 1 && interval < 3 || interval > 10) { return Timetxt = "منذ " + Math.floor(interval) + " دقيقة"; }

    Timetxt = "منذ قليل";
}

// اكواد خاضة بالاشعارات
function Toast(id, txt) {
    let icon = "bell"
    if (id === "Success") { icon = "check" }
    if (id === "Error") { icon = "x" }
    let Toasts = document.querySelector(".Toasts")
    let length = Toasts.querySelectorAll(".Toast").length
    let MyToast = `
        <div class="Toast index-${length}"  id="${id}">
            <i class="bx bx-${icon}"></i>
            <div>
                <h4>${id}</h4>
                <h4 class="Toast-Txt">${txt} </h4>
            </div>
            <i onclick="CloseToast(index = ${length})" class="bx bx-x X-Toast"></i>
        </div> `
    Toasts.innerHTML += MyToast
    if (User.VoiceMessage === true) { window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt)) }
    setTimeout(() => { Toasts.querySelectorAll(".Toast")[length].classList.add("active") }, 100);
    setTimeout(() => { CloseToast(index = length) }, 5000);
}

function CloseToast(index) {
    let Toasts = document.querySelector(".Toasts")
    let Toast = Toasts.querySelector(`.index-${index}`)
    if (Toast) {
        Toast.classList.remove("active")
        setTimeout(() => { Toast.remove() }, 500);
    }
}

function ReadNotification() {
    let ItemsNotfcations = document.querySelectorAll(".Notificat-items .item")
    ItemsNotfcations.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("UnRead")) {
                fetch("/ReadNotification" + item.id, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id })
                })
                    .then((res) => res.json())
                    .then((Data) => { if (Data.id === "Success") { item.classList.replace("UnRead", "Read") } })
                    .catch((err) => { return location.href = "/Error" })
            }

        })
    });
}

// Sent Message
function NewMessage(id) {
    let Form = document.querySelector(".Form-Message")
    let Message = Form.querySelector(".Message")

    Message.classList.remove("Required");

    if (Message.value === "") { Message.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }

    fetch("/MessageToCustomer", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ToEmail: Form.querySelector(".ToEmail").innerText, Message: Message.value,
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
function FormMessage(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement
    let Form = document.querySelector(".Form-Message")

    Form.classList.toggle("active")
    Form.querySelector(".ToEmail").innerText = parent.querySelectorAll("td")[2].innerText;
    Form.querySelector("textarea").value = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quidem culpa animi velit esse tempora"

}


function ShareData() {
    if (!navigator.share) return
    navigator.share({
        title: "loma",
        text: "hello world",
        url: "https://www.facebook.com",
    })
}