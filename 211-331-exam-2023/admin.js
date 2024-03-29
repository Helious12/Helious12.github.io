const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const api_Key = "8baecf6d-a045-4b7f-81cf-d338d03be93d";
let allData;

const Days = ["01-01", "02-23", "03-08", "05-09", "09-01", "06-12", "05-01"];

function showAlert(error, color) {
  let alerts = document.querySelector(".alerts");
  let alert = document.createElement("div");
  alert.classList.add("alert", "alert-dismissible", color);
  alert.setAttribute("role", "alert");
  alert.append(error);
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.classList.add("btn-close");
  alert.classList.add("position-sticky");
  alert.classList.add("end-50");
  alert.classList.add("my-0");
  btn.setAttribute("data-bs-dismiss", "alert");
  btn.setAttribute("aria-label", "Close");
  alert.append(btn);
  alerts.append(alert);
  setTimeout(() => alert.remove(), 4000);
}

async function nameOfRoute(idRoute) {
  let nUrl = new URL(url + "routes/" + idRoute);
  nUrl.searchParams.append("api_key", api_Key);
  let nameRoute = "";
  try {
    let response = await fetch(nUrl);
    let route = await response.json();
    nameRoute = route.name;
  } catch (error) {
    console.log(error.message);
  }
  return nameRoute;
}

async function nameOfGuide(idGuide) {
  let nUrl = new URL(url + "guides/" + idGuide);
  nUrl.searchParams.append("api_key", api_Key);
  let nameGuide = "";
  try {
    let response = await fetch(nUrl);
    let guide = await response.json();
    document
      .querySelector(".table-routes")
      .setAttribute("data-pricePerHour", guide.pricePerHour);
    nameGuide = guide.name;
  } catch (error) {
    console.log(error.message);
  }
  return nameGuide;
}

//nút xóa
function clickOnTrash(event) {
  if (!event.target.classList.contains("bi-trash-fill")) return;
  let idTask = event.target.parentNode.parentNode.id;
  document.querySelector(".delete").setAttribute("data-task-id", idTask);
}

// nút xem
function clickOnEye(event) {
  if (!event.target.classList.contains("bi-eye-fill")) return;
  let modal = document.querySelector("#showTask");
  modal.querySelector("#exModalLabel").textContent =
    "Request number " + event.target.parentNode.parentNode.id;

  let guideId =
    event.target.parentNode.parentNode.getAttribute("data-guide-id");
  let guideFio = modal.querySelector("#name");
  nameOfGuide(guideId).then((response) => (guideFio.value = response));

  let routeName = modal.querySelector("#route");
  routeName.value = event.target.parentNode.parentNode.children[1].textContent;

  let date = modal.querySelector("#date");
  date.setAttribute("readonly", "");
  let strDate =
    event.target.parentNode.parentNode.children[2].textContent.split(".");
  let trueDate = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);
  date.value = trueDate.toJSON().slice(0, 10);

  let time = modal.querySelector("#time");
  time.setAttribute("readonly", "");
  let timeRoute = event.target.parentNode.parentNode.getAttribute("data-time");
  time.value = timeRoute;

  let duration = modal.querySelector("#selectLength");
  duration.setAttribute("disabled", "");
  let durationRoute =
    event.target.parentNode.parentNode.getAttribute("data-duration");
  duration.value = durationRoute;

  let personsRange = modal.querySelector("#customRange2");
  personsRange.setAttribute("readonly", "");
  personsRange.setAttribute("disabled", "");

  let personsText = modal.querySelector("#number-people");
  personsText.setAttribute("readonly", "");
  personsText.setAttribute("disabled", "");
  let persons = event.target.parentNode.parentNode.getAttribute("data-persons");
  personsRange.value = persons;
  personsText.value = persons;

  let options = modal.querySelector(".options");
  options.innerHTML = "";
  options.textContent = "Additional options: ";
  let switches = modal.querySelectorAll(".form-switch");
  for (let switz of switches) {
    switz.innerHTML = "";
  }
  let option1 = document.createElement("input");
  option1.setAttribute("type", "text");
  option1.classList.add("form-control-plaintext");
  option1.setAttribute("readonly", "");
  option1.value = "Discount for pensioners (25% discount)";
  let routeOptionF =
    event.target.parentNode.parentNode.getAttribute("data-option1");
  if (routeOptionF == "true") options.append(option1);

  let option2 = document.createElement("textarea");
  option2.setAttribute("type", "text");
  option2.classList.add("form-control-plaintext");
  option2.setAttribute("readonly", "");
  option2.value =
    "Thematic souvenirs for visitors (+500 rubles for each visitor)";
  let routeOptionS =
    event.target.parentNode.parentNode.getAttribute("data-option2");
  if (routeOptionS == "true") options.append(option2);

  let price = modal.querySelector("#price");
  let priceRoute = event.target.parentNode.parentNode.children[3].textContent;
  price.value = priceRoute;
  modal.querySelector(".back-btn").classList.add("d-none");
  let createBtn = modal.querySelector(".create-btn");
  createBtn.setAttribute("data-bs-dismiss", "modal");
  createBtn.classList.remove("create-change-task");
  createBtn.textContent = "Done";
}

// các logic khi sửa
function numberOfVisitors() {
  let form = document.querySelector("#create-task-form");
  let number = form.elements["customRange2"].value;
  let plus = 0;
  if (number <= 5) plus = 0;
  else if (number > 5 && number <= 10) plus = 1000;
  else if (number > 10 && number <= 20) plus = 1500;
  return plus;
}

function isThisDayOff() {
  let form = document.querySelector("#create-task-form");
  let isDay = new Date(form.elements["date"].value);
  let YearMonthDay = isDay.toJSON().slice(0, 10).split("-");
  let MonthDay = YearMonthDay[1] + "-" + YearMonthDay[2];
  let plus = 1;
  if (isDay.getDay() == 0 || isDay.getDay() == 6 || Days.includes(MonthDay)) {
    plus = 1.5;
  }
  return plus;
}

function isItMorningOrEvening() {
  let form = document.querySelector("#create-task-form");
  let time = parseInt(form.elements["time"].value.split(":")[0]);
  let plus = 0;
  if (time >= 9 && time < 12) plus = 400;
  else if (time >= 20 && time <= 23) plus = 1000;
  return plus;
}

function hoursNumber() {
  let form = document.querySelector("#create-task-form");
  let hours = form.elements["selectLength"].value;
  return hours;
}

function checkOptionFirst() {
  let option = document.querySelector("#option1");
  let price = 1;
  if (option.checked) {
    price = 0.75;
  }
  return price;
}

function checkOptionSecond() {
  let option = document.querySelector("#option2");
  let price = 0;
  let form = document.querySelector("#create-task-form");
  let number = form.elements["customRange2"].value;
  if (option.checked) {
    price = 500 * number;
  }
  return price;
}

function guideServiceCost() {
  let price = document
    .querySelector(".table-routes")
    .getAttribute("data-pricePerHour");
  return price;
}

function changeTotalPrice(event) {
  let form = document.querySelector("#create-task-form");
  let price =
    (guideServiceCost() * hoursNumber() * isThisDayOff() +
      isItMorningOrEvening() +
      numberOfVisitors() +
      checkOptionSecond()) *
    checkOptionFirst();
  form.elements["price"].value = parseInt(price);
}

function changeTotalPriceForPersons(event) {
  document.querySelector("#number-people").value = event.target.value;
  let form = document.querySelector("#create-task-form");
  let price =
    (guideServiceCost() * hoursNumber() * isThisDayOff() +
      isItMorningOrEvening() +
      numberOfVisitors() +
      checkOptionSecond()) *
    checkOptionFirst();
  form.elements["price"].value = parseInt(price);
}


// nút sửa sử dụng các hàm logic
function clickOnPen(event) {
  if (!event.target.classList.contains("bi-pencil-square")) return;
  let modal = document.querySelector("#showTask");
  modal.querySelector("#exModalLabel").textContent = "Editing an application";
  let guideId =
    event.target.parentNode.parentNode.getAttribute("data-guide-id");
  let tasked = event.target.parentNode.parentNode.id;
  modal.querySelector(".create-btn").setAttribute("data-task-id", tasked);
  let guideFio = modal.querySelector("#name");
  let priceHour = document.querySelector(".table-routes");
  nameOfGuide(guideId).then((response) => (guideFio.value = response));

  let routeName = modal.querySelector("#route");
  routeName.value = event.target.parentNode.parentNode.children[1].textContent;

  let date = modal.querySelector("#date");
  date.removeAttribute("readonly");
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  date.setAttribute("min", newDate.toJSON().slice(0, 10));
  let strDate =
    event.target.parentNode.parentNode.children[2].textContent.split(".");
  let trueDate = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);
  date.value = trueDate.toJSON().slice(0, 10);

  let time = modal.querySelector("#time");
  time.removeAttribute("readonly");
  let timeRoute = event.target.parentNode.parentNode.getAttribute("data-time");
  time.value = timeRoute;

  let duration = modal.querySelector("#selectLength");
  duration.removeAttribute("disabled");
  let durationRoute =
    event.target.parentNode.parentNode.getAttribute("data-duration");
  duration.value = durationRoute;

  let personsRange = modal.querySelector("#customRange2");
  personsRange.removeAttribute("readonly");
  personsRange.removeAttribute("disabled");
  personsRange.oninput = changeTotalPriceForPersons;
  let personsText = modal.querySelector("#number-people");
  let persons = event.target.parentNode.parentNode.getAttribute("data-persons");
  personsRange.value = persons;
  personsText.value = persons;

  modal.querySelector(".options").innerHTML = "";

  let option1 = modal.querySelector(".form-switch-option1");
  option1.innerHTML = "";
  let switchInput1 = document.createElement("input");
  switchInput1.classList.add("form-check-input");
  switchInput1.setAttribute("type", "checkbox");
  switchInput1.setAttribute("role", "switch");
  switchInput1.setAttribute("id", "option1");
  switchInput1.oninput = changeTotalPrice;
  let switchLabel1 = document.createElement("label");
  switchLabel1.classList.add("form-check-label");
  switchLabel1.setAttribute("for", "option1");
  switchLabel1.textContent = "Use the senior citizen discount";
  let routeOptionF =
    event.target.parentNode.parentNode.getAttribute("data-option1");
  if (routeOptionF == "true") {
    switchInput1.checked = true;
    switchInput1.setAttribute("readonly", "");
    switchInput1.setAttribute("disabled", "");
  } else {
    switchInput1.checked = false;
    switchInput1.removeAttribute("readonly");
    switchInput1.removeAttribute("disabled");
  }
  option1.append(switchInput1);
  option1.append(switchLabel1);

  let option2 = modal.querySelector(".form-switch-option2");
  option2.innerHTML = "";
  let switchInput2 = document.createElement("input");
  switchInput2.classList.add("form-check-input");
  switchInput2.setAttribute("type", "checkbox");
  switchInput2.setAttribute("role", "switch");
  switchInput2.setAttribute("id", "option2");
  switchInput2.oninput = changeTotalPrice;
  let switchLabel2 = document.createElement("label");
  switchLabel2.classList.add("form-check-label");
  switchLabel2.setAttribute("for", "option2");
  switchLabel2.textContent = "Thematic souvenirs for visitors";
  let routeOptionS =
    event.target.parentNode.parentNode.getAttribute("data-option2");
  if (routeOptionS == "true") {
    switchInput2.checked = true;
    switchInput2.setAttribute("readonly", "");
    switchInput2.setAttribute("disabled", "");
  } else {
    switchInput2.checked = false;
    switchInput2.removeAttribute("readonly");
    switchInput2.removeAttribute("disabled");
  }
  option2.append(switchInput2);
  option2.append(switchLabel2);

  let price = document.querySelector("#price");
  let priceRoute = event.target.parentNode.parentNode.children[3].textContent;
  price.value = priceRoute;

  modal.querySelector(".back-btn").classList.remove("d-none");
  let createBtn = modal.querySelector(".create-btn");
  createBtn.removeAttribute("data-bs-dismiss");
  createBtn.textContent = "Save";
  createBtn.classList.add("create-change-task");
}

// tạo tuyến đường và ngày
function createRoute(data, number) {
  let table = document.querySelector(".table-routes");
  let row = document.createElement("tr");
  row.setAttribute("id", data.id);
  row.setAttribute("data-guide-id", data.guide_id);
  row.setAttribute("data-time", data.time);
  row.setAttribute("data-duration", data.duration);
  row.setAttribute("data-persons", data.persons);
  row.setAttribute("data-option1", data.optionFirst);
  row.setAttribute("data-option2", data.optionSecond);

  let th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.textContent = number;
  row.append(th);

  let name = document.createElement("td");
  nameOfRoute(data.route_id).then((response) => (name.textContent = response));
  row.append(name);

  let dateRoute = document.createElement("td");
  let dateset = new Date(data.date);
  const newLocal = (DayMonthYear = dateset.toJSON().slice(0, 10).split("-"));
  dateRoute.textContent =
    DayMonthYear[2] + "." + DayMonthYear[1] + "." + DayMonthYear[0];
  row.append(dateRoute);

  let priceRoute = document.createElement("td");
  priceRoute.textContent = data.price;
  row.append(priceRoute);

  let actions = document.createElement("td");
  actions.classList.add("d-flex");
  actions.classList.add("flex-wrap");
  let eye = document.createElement("i");
  eye.classList.add("bi");
  eye.classList.add("bi-eye-fill");
  eye.classList.add("mx-2");
  eye.setAttribute("data-bs-toggle", "modal");
  eye.setAttribute("data-bs-target", "#showTask");
  eye.onclick = clickOnEye;
  actions.append(eye);

  let pen = document.createElement("i");
  pen.classList.add("bi");
  pen.classList.add("bi-pencil-square");
  pen.classList.add("mx-2");
  pen.setAttribute("data-bs-toggle", "modal");
  pen.setAttribute("data-bs-target", "#showTask");
  pen.onclick = clickOnPen;
  actions.append(pen);

  let trash = document.createElement("i");
  trash.classList.add("bi");
  trash.classList.add("bi-trash-fill");
  trash.classList.add("ms-2");
  trash.setAttribute("data-bs-toggle", "modal");
  trash.setAttribute("data-bs-target", "#deleteTask");
  trash.onclick = clickOnTrash;
  actions.append(trash);
  row.append(actions);

  table.append(row);
}

// số lượng trang 
function pageBtnHandler(event) {
  if (!event.target.classList.contains("page-link")) return;
  let oldBtn = document.querySelector(".active");
  oldBtn.classList.remove("active");
  event.target.classList.add("active");
  createElements(allData);
}

// tạo các phần tử bảng sau khi lưu
function createElements(data) {
  document.querySelector(".table-routes").innerHTML = "";
  let oldBtn = document.querySelector(".active");
  let pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  for (let i = 1; i < Math.ceil(data.length / 5) + 1; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.classList.add("bg-secondary");
    a.classList.add("text-warning");
    if (oldBtn.textContent == i) a.classList.add("active");
    a.setAttribute("href", "#");
    a.textContent = i;
    a.onclick = pageBtnHandler;
    li.append(a);
    pagination.append(li);
  }

  let currentPage = document.querySelector(".active").textContent;
  let start = currentPage * 5 - 5;
  let end = start + 5 > data.length ? start + (data.length % 5) : start + 5;
  for (let i = start; i < end; i++) {
    createRoute(data[i], i + 1);
  }
}

async function downloadData() {
  let nUrl = new URL(url + "orders");
  nUrl.searchParams.append("api_key", api_Key);

  try {
    let response = await fetch(nUrl);
    let data = await response.json();
    allData = JSON.parse(JSON.stringify(data));
    createElements(data);
  } catch (error) {
    console.log(error.message);
  }
}

// xóa tuyến đường
async function deleteTask(event) {
  if (!event.target.classList.contains("delete")) return;
  let idTask = event.target.getAttribute("data-task-id");
  let nUrl = new URL(url + "orders/" + idTask);
  nUrl.searchParams.append("api_key", api_Key);
  try {
    let response = await fetch(nUrl, {
      method: "DELETE",
    });
    let data = await response.json();
    document.querySelector(".page-link").classList.add("active");
    if (data.error) showAlert(data.error, "alert-danger");
    else showAlert("Application successfully deleted", "alert-success");
    downloadData();
  } catch (error) {
    console.log(error.message);
  }
}

// lưu sau khi sửa
async function saveNewTask(event) {
  if (!event.target.classList.contains("create-change-task")) return;
  let formForSend = new FormData();
  let form = document.querySelector("#create-task-form");
  formForSend.append("date", form.elements["date"].value);
  formForSend.append("time", form.elements["time"].value);
  formForSend.append("duration", form.elements["selectLength"].value);
  formForSend.append("persons", form.elements["customRange2"].value);
  formForSend.append("price", form.elements["price"].value);
  formForSend.append("optionFirst", form.elements["option1"].checked ? 1 : 0);
  formForSend.append("optionSecond", form.elements["option2"].checked ? 1 : 0);
  let tasked = event.target.getAttribute("data-task-id");
  let nUrl = new URL(url + "orders/" + tasked);
  nUrl.searchParams.append("api_key", api_Key);

  if (form.elements["time"].validity.valid) {
    try {
      event.target.setAttribute("type", "button");
      let modal = document.querySelector("#showTask");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      let response = await fetch(nUrl, {
        method: "PUT",
        body: formForSend,
      });
      let data = await response.json();
      if (data.error) showAlert(data.error, "alert-danger");
      else showAlert("Request modified successfully", "alert-success");
      downloadData();
      console.log(data);
    } catch (error) {
      showAlert(error.message, "alert-danger");
    }
  } else {
    event.target.setAttribute("type", "submit");
  }
}

window.onload = function () {
  downloadData();
  document.querySelector(".delete").onclick = deleteTask;
  document.querySelector("#selectLength").oninput = changeTotalPrice;
  document.querySelector("#time").oninput = changeTotalPrice;
  document.querySelector("#date").oninput = changeTotalPrice;
  document.querySelector("#option1").oninput = changeTotalPrice;
  document.querySelector("#option2").oninput = changeTotalPrice;
  document.querySelector(".create-btn").onclick = saveNewTask;
};
