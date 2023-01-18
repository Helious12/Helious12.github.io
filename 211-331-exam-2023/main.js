const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const api_Key = "8baecf6d-a045-4b7f-81cf-d338d03be93d";
let allRoutes;

const Days = ["01-01", "02-23", "03-08", "05-09", "09-01", "06-12", "05-01"];

// alert ---------------------------------------------------------------------------
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

// table 1 ------------------------------------------------------------------------

// drop menu main object 
function clickMainOb(event) {
  let mainObject = document.querySelector(".btn-main-object");
  mainObject.textContent = event.target.textContent;
  searchBtnHandler();
}

// create table head 
function createTooltipTh(data) {
  let desc = document.createElement("th");
  desc.setAttribute("data-bs-toggle", "tooltip");
  desc.setAttribute("data-bs-placement", "top");
  desc.setAttribute("data-bs-custom-class", "custom-tooltip");
  desc.setAttribute("data-bs-title", data);

  return desc;
}

// create table data 
function createTooltip(data) {
  let desc = document.createElement("td");
  desc.setAttribute("data-bs-toggle", "tooltip");
  desc.setAttribute("data-bs-placement", "top");
  desc.setAttribute("data-bs-custom-class", "custom-tooltip");
  desc.setAttribute("data-bs-title", data);
  return desc;
}

// table 2 -----------------------------------------------------------------------
// tạo hàm để nếu đã chọn dữ liệu thì nút checkout sẽ sáng lên 
function onClickGui(event) {
  if (!event.target.classList.contains("btn")) return;
  let oldBtn = document.querySelector(".btn-guide");
  if (oldBtn) {
    oldBtn.classList.remove("btn-guide");
    oldBtn.classList.remove("btn-secondary");
    oldBtn.classList.add("btn-light");
  }
  event.target.classList.add("btn-guide");
  event.target.classList.remove("btn-light");
  event.target.classList.add("btn-secondary");
  document.querySelector(".checkout-route").removeAttribute("disabled");
  document.querySelector(".checkout-route").scrollIntoView();
}

// Hàm bộ lọc ngôn ngữ trong những phần đã chọn
function createLanguageList(guides) {
  let newList = [];
  let list = document.querySelector(".language-list");
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.setAttribute("href", "#");
  a.classList.add("dropdown-item");
  a.textContent = "Tour language";
  li.append(a);
  list.append(li);
  for (let guide of guides) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.setAttribute("href", "#");
    a.classList.add("dropdown-item");
    a.textContent = guide.language;
    li.append(a);
    if (!newList.includes(guide.language)) {
      newList.push(guide.language);
      list.append(li);
    }
  }
}

// tạo dữ liệu cho bảng
function createGuiTab(guides, lang, minInput, maxInput) {
  let guidesTable = document.querySelector(".table-guides");
  guidesTable.innerHTML = "";
  document.querySelector(".language-list").innerHTML = "";
  createLanguageList(guides);
  for (let guide of guides) {
    let row = document.createElement("tr");
    row.classList.add("fs-6");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.classList.add("fs-1");
    th.classList.add("text-center");
    let icon = document.createElement("span");
    icon.classList.add("bi");
    icon.classList.add("bi-person-rolodex");
    th.append(icon);
    row.append(th);

    let nameGuide = document.createElement("td");
    nameGuide.classList.add("nameOfGuide");
    nameGuide.textContent = guide.name;
    row.append(nameGuide);

    let languageGuide = document.createElement("td");
    languageGuide.textContent = guide.language;
    row.append(languageGuide);

    let workExp = document.createElement("td");
    workExp.textContent = guide.workExperience;
    row.append(workExp);

    let price = document.createElement("td");
    price.classList.add("priceOfGuide");
    price.textContent = guide.pricePerHour;
    row.append(price);

    let btnTd = document.createElement("td");
    let btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("btn-light");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Да";
    btn.setAttribute("data-guide-id", guide.id);
    btnTd.append(btn);
    btnTd.onclick = onClickGui;
    row.append(btnTd);

    if (
      lang == guide.language &&
      minInput <= guide.workExperience &&
      guide.workExperience <= maxInput
    )
      guidesTable.append(row);
    else if (
      lang == "Tour language" &&
      minInput <= guide.workExperience &&
      guide.workExperience <= maxInput
    ) {
      guidesTable.append(row);
    }
  }
  // nếu ko có phần tử nào checkout tắt
  if (document.querySelector(".table-guides").children.length == 0) {
    document.querySelector(".checkout-route").setAttribute("disabled", "");
  }
}
 // lọc kinh nghiệm làm việc
function createWorkExperience(data) {
  let minInput = document.querySelector("#work-min-experience");
  let maxInput = document.querySelector("#work-max-experience");
  maxInput.value = "";
  minInput.value = "";
  let min = 1000;
  let max = 0;
  for (let guide of data) {
    if (guide.workExperience < min) {
      min = guide.workExperience;
    }
    if (guide.workExperience > max) {
      max = guide.workExperience;
    }
  }
  maxInput.value = max;
  minInput.value = min;
}

// async là bất đồng bộ tức là đáng ra phải thực hiện từ trên xuống (sync) nhưng bất đồng bộ là nhảy qua 1 hàm

// tạo các hàm để search tuyến đường

// list 1 hàm tìm người hướng dẫn
async function searchingGuides(idRoute) {
  let nUrl = new URL(url + "routes/" + idRoute + "/guides");
  nUrl.searchParams.append("api_key", api_Key);
  try {
    let response = await fetch(nUrl);
    let data = await response.json();
    createGuiTab(data, "Tour language", 0, 50);
    createWorkExperience(data);
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
}

// list 1 tìm người hướng dẫn cho lệnh tìm sử dụng hàm tìm người hướng dẫn
function searchGuidesForRoute(event) {
  if (!event.target.classList.contains("btn-for-guides")) return;
  document
    .querySelector(".search-btn-guides")
    .setAttribute("data-route-id", event.target.id);
  document.querySelector(".checkout-route").setAttribute("disabled", "");
  let nameOfRoute = document.querySelector(".guides").querySelector("p");
  nameOfRoute.textContent = "";
  nameOfRoute.scrollIntoView();
  let oldBtn =
    event.target.parentNode.parentNode.parentNode.querySelector(
      ".btn-secondary"
    );
  if (oldBtn) {
    oldBtn.classList.remove("btn-secondary");
    oldBtn.classList.add("btn-light");
  }

  event.target.classList.remove("btn-light");
  event.target.classList.add("btn-secondary");
  let str = "Available guides for the route: ";
  let onClickRoute = event.target.parentNode.parentNode;
  nameOfRoute.textContent =
    str + onClickRoute.firstChild.getAttribute("data-bs-title");
  document.querySelector(".btn-language").textContent = "Tour language";
  searchingGuides(event.target.id);
}

// list 1 tạo ra tuyến đường dựa trên hàm tìm người hướng dẫn 
function createRoute(data) {
  let table = document.querySelector(".table-routes");
  let row = document.createElement("tr");
  let th = createTooltipTh(data.name);
  th.setAttribute("scope", row);
  let numOfChars = 0;
  let name = "";
  for (let char of data.name) {
    if (numOfChars == 30) {
      name += "...";
      break;
    }
    name += char;
    numOfChars++;
  }

  th.textContent = name;
  row.append(th);

  numOfChars = 0;
  let descWords = "";
  for (let char of data.description) {
    if (numOfChars == 20) break;
    descWords += char;
    numOfChars++;
  }
  let desc = createTooltip(data.description);

  desc.textContent = descWords + "...";

  row.append(desc);

  numOfChars = 0;
  let mainObjects = "";
  for (let char of data.mainObject) {
    if (numOfChars == 20) break;
    mainObjects += char;
    numOfChars++;
  }
  let mainObj = createTooltip(data.mainObject);
  mainObj.textContent = mainObjects + "...";
  row.append(mainObj);

  let btnTd = document.createElement("td");
  let btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn-light");
  btn.classList.add("btn-for-guides");
  btn.setAttribute("type", "button");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("id", data.id);

  btn.textContent = "Да";
  btnTd.append(btn);
  btnTd.onclick = searchGuidesForRoute;
  row.append(btnTd);

  table.append(row);
}

// tạo bảng và số thứ tự trang cho list 1
function createTableRouteElements(allData) {
  console.log(allData);
  document.querySelector(".table-routes").innerHTML = "";
  let oldBtn = document.querySelector(".active");
  let pagination = document.querySelector(".pagination");
  if (allData.length != allRoutes.length) {
    pagination.innerHTML = "";
    let li = document.createElement("li");
    li.classList.add("page-item");
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.classList.add("bg-secondary");
    a.classList.add("text-warning");
    if (oldBtn.textContent == "1") a.classList.add("active");
    a.setAttribute("href", "#");
    a.textContent = 1;
    li.append(a);
    pagination.append(li);
  }

  if (pagination.children.length == 1) {
    for (let i = 2; i < Math.ceil(allData.length / 10) + 1; i++) {
      let li = document.createElement("li");
      li.classList.add("page-item");
      let a = document.createElement("a");
      a.classList.add("page-link");
      a.classList.add("bg-secondary");
      a.classList.add("text-warning");
      if (oldBtn.textContent == i) a.classList.add("active");
      a.setAttribute("href", "#");
      a.textContent = i;
      li.append(a);
      pagination.append(li);
    }
  }

  let currentPage = document.querySelector(".active").textContent;
  let start = currentPage * 10 - 10;
  let end =
    start + 10 > allData.length ? start + (allData.length % 10) : start + 10;
  for (let i = start; i < end; i++) {
    createRoute(allData[i]);
  }
  let childs = document.querySelector(".table-routes").children;
  for (let child of childs) {
    console.log(child.firstElementChild.getAttribute("data-bs-title"));
  }

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

// list 1 tìm data khi chọn trong ô main object
function downloadMainOb(data) {
  let dropList = document.querySelector(".main-objects-list");
  let newList = [];
  for (let drop of data) {
    let l = drop.mainObject.split("-");
    for (let newObj of l) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.classList.add("dropdown-item");
      a.setAttribute("href", "#");
      if (!newList.includes(newObj)) {
        let numOfChars = 0;
        let shortString = "";
        for (let char of newObj) {
          if (numOfChars == 13) {
            break;
          }
          numOfChars++;
          shortString += char;
        }
        a.textContent = shortString + "...";
        a.setAttribute("data-bs-toggle", "tooltip");
        a.setAttribute("data-bs-placement", "top");
        a.setAttribute("data-bs-custom-class", "custom-tooltip");
        a.setAttribute("data-bs-title", newObj);
        newList.push(newObj);
        li.append(a);
        dropList.append(li);
      }
    }
  }
}


function createTableElementsDownload(allData) {
  let oldBtn = document.querySelector(".active");
  document.querySelector(".table-routes").innerHTML = "";
  let pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  for (let i = 1; i < Math.ceil(allData.length / 10) + 1; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.classList.add("bg-secondary");
    a.classList.add("text-warning");
    if (oldBtn.textContent == i) a.classList.add("active");
    a.setAttribute("href", "#");
    a.textContent = i;
    li.append(a);
    pagination.append(li);
  }
  let currentPage = document.querySelector(".active").textContent;
  let start = currentPage * 10 - 10;
  let end =
    start + 10 > allData.length ? start + (allData.length % 10) : start + 10;
  for (let i = start; i < end; i++) {
    createRoute(allData[i]);
  }
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}
async function downloadData() {
  let nUrl = new URL(url + "routes");
  nUrl.searchParams.append("api_key", api_Key);
  try {
    let response = await fetch(nUrl);
    let data = await response.json();
    allRoutes = JSON.parse(JSON.stringify(data));
    downloadMainOb(data);
    createTableElementsDownload(data);
    showAlert("Data uploaded successfully", "alert-success");
  } catch (error) {
    showAlert(error.message, "alert-danger");
  }
}

// list 1 tìm tuyến đường trong search
async function searchBtnHandler() {
  let searchField = document.querySelector(".search-field").value;
  let nUrl = new URL(url + "routes");
  nUrl.searchParams.append("api_key", api_Key);
  let mainObj = document.querySelector(".btn-main-object");
  let newRoutes = [];
  try {
    if (searchField == "" && mainObj.textContent == "Main object")
      downloadData();
    else {
      let response = await fetch(nUrl);
      let data = await response.json();
      let str = mainObj.textContent.slice(0, -4);
      for (let route of data) {
        if (mainObj.textContent == "Main object") {
          if (route.name.includes(searchField)) newRoutes.push(route);
        } else if (searchField == "" && mainObj.textContent != "Main object") {
          if (route.mainObject.includes(str)) newRoutes.push(route);
        } else if (
          route.name.includes(searchField) &&
          route.mainObject.includes(str) &&
          mainObj.textContent != "Main object"
        ) {
          newRoutes.push(route);
        }
      }
      createTableRouteElements(newRoutes);
    }
  } catch (error) {
    showAlert(error.message, "alert-danger");
  }
}

// list number
function pageBtnHandler(event) {
  if (!event.target.classList.contains("page-link")) return;

  let oldBtn = document.querySelector(".active");
  oldBtn.classList.remove("active");
  console.log(oldBtn.textContent);
  event.target.classList.add("active");
  searchBtnHandler();
}

// list 1 search lấy thông tin mình nhập vào từ đầu vào
function searchFieldInput() {
  let oldBtn = document.querySelector(".active");
  oldBtn.classList.remove("active");
  document.querySelector(".page-item").classList.add("active");
}

// list 1 main object khi nhấn vào
function btnMainObjectClick() {
  let oldBtn = document.querySelector(".active");
  oldBtn.classList.remove("active");
  document
    .querySelector(".pagination")
    .firstChild.firstChild.classList.add("active");
}

// list 2 tìm người hướng dẫn theo ngôn ngữ
async function searchGuidesWithLanguageClick() {
  let language = document.querySelector(".btn-language");
  let minInput = document.querySelector("#work-min-experience");
  let maxInput = document.querySelector("#work-max-experience");
  let dataRouteId = document
    .querySelector(".search-btn-guides")
    .getAttribute("data-route-id");
  let nUrl = new URL(url + "routes/" + dataRouteId + "/guides");
  nUrl.searchParams.append("api_key", api_Key);

  try {
    let response = await fetch(nUrl);
    let data = await response.json();
    createGuiTab(data, language.textContent, minInput.value, maxInput.value);
  } catch (error) {
    showAlert("Not found", "alert-warning");
  }
}

// như hàm trên
function btnLanguageClick(event) {
  if (!event.target.classList.contains("dropdown-item")) return;
  document.querySelector(".btn-language").textContent =
    event.target.textContent;
  searchGuidesWithLanguageClick();
}

// thay đổi theo bộ lọc kinh nghiệm
function changeWorkExperience(event) {
  console.log(event.target.value);
}

async function searchGuidesWithFilters(event) {
  let language = document.querySelector(".btn-language");
  let minInput = document.querySelector("#work-min-experience");
  let maxInput = document.querySelector("#work-max-experience");
  let nUrl = new URL(
    url + "routes/" + event.target.getAttribute("data-route-id") + "/guides"
  );
  nUrl.searchParams.append("api_key", api_Key);

  try {
    let response = await fetch(nUrl);
    let data = await response.json();
    createGuiTab(data, language.textContent, minInput.value, maxInput.value);
  } catch (error) {
    showAlert("Not found", "alert-warning");
  }
}

// hàm logic ----------------------------------------------------------
function numberOfVisitors() {
  let form = document.querySelector("#create-task-form");
  let number = form.elements["customRange2"].value;
  let plus = 0;
  if (number <= 5) plus = 0;
  else if (number > 5 && number <= 10) plus = 1000;
  else if (number > 10 && number <= 20) plus = 1500;
  return plus;
}

function guideService() {
  let checkedGuide = document.querySelector(".btn-guide");
  let guideInfo = checkedGuide.parentElement.parentElement.children;
  let name = "";
  let price = 0;
  for (let guide of guideInfo) {
    if (guide.classList.contains("nameOfGuide")) name = guide.textContent;
    if (guide.classList.contains("priceOfGuide"))
      price = parseInt(guide.textContent);
  }
  return price;
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

function checkOption1() {
  let option = document.querySelector("#option1");
  let price = 1;
  if (option.checked) {
    price = 0.75;
  }
  return price;
}

function checkOption2() {
  let option = document.querySelector("#option2");
  let price = 0;
  let form = document.querySelector("#create-task-form");
  let number = form.elements["customRange2"].value;
  if (option.checked) {
    price = 500 * number;
  }
  return price;
}

function changeNumberOfPeople(event) {
  document.querySelector("#number-people").value = event.target.value;
  let form = document.querySelector("#create-task-form");
  let checkedGuide = document.querySelector(".btn-guide");
  let guideInfo = checkedGuide.parentElement.parentElement.children;
  let name = "";
  let price = 0;
  for (let guide of guideInfo) {
    if (guide.classList.contains("nameOfGuide")) name = guide.textContent;
    if (guide.classList.contains("priceOfGuide"))
      price = parseInt(guide.textContent);
  }
  price =
    (guideService() * hoursNumber() * isThisDayOff() +
      isItMorningOrEvening() +
      numberOfVisitors() +
      checkOption2()) *
    checkOption1();
  form.elements["price"].value = parseInt(price);
}


// khi thanh toán xong đi vào trang xem
function checkoutRoute(event) {
  let form = document.querySelector("#create-task-form");
  let checkedGuide = document.querySelector(".btn-guide");
  let guideInfo = checkedGuide.parentElement.parentElement.children;
  let route = document.querySelector(".guides").textContent.split(":");
  let date = new Date();
  date.setDate(date.getDate() + 1);
  form.querySelector("#date").value = date.toJSON().slice(0, 10);
  form.querySelector("#date").setAttribute("min", date.toJSON().slice(0, 10));
  let name = "";
  let price = 0;
  for (let guide of guideInfo) {
    if (guide.classList.contains("nameOfGuide")) name = guide.textContent;
    if (guide.classList.contains("priceOfGuide"))
      price = parseInt(guide.textContent);
  }
  form.elements["name"].value = name;
  form.elements["route"].value = route[1];
  price =
    (guideService() * hoursNumber() * isThisDayOff() +
      isItMorningOrEvening() +
      numberOfVisitors() +
      checkOption2()) *
    checkOption1();
  form.elements["price"].value = parseInt(price);
}

// giá cuối cùng
function changeTotalPrice(event) {
  let form = document.querySelector("#create-task-form");
  let price =
    (guideService() * hoursNumber() * isThisDayOff() +
      isItMorningOrEvening() +
      numberOfVisitors() +
      checkOption2()) *
    checkOption1();
  form.elements["price"].value = parseInt(price);
}

// gửi thông tin lên admin
async function sendRequest(event) {
  if (!event.target.classList.contains("create-btn")) return;
  let formForSend = new FormData();
  let guideId = document
    .querySelector(".btn-guide")
    .getAttribute("data-guide-id");
  let routeId = document
    .querySelector(".search-btn-guides")
    .getAttribute("data-route-id");
  let form = document.querySelector("#create-task-form");
  formForSend.append("guide_id", guideId);
  formForSend.append("route_id", routeId);
  formForSend.append("date", form.elements["date"].value);
  formForSend.append("time", form.elements["time"].value);
  formForSend.append("duration", form.elements["selectLength"].value);
  formForSend.append("persons", form.elements["customRange2"].value);
  formForSend.append("price", form.elements["price"].value);
  formForSend.append("optionFirst", form.elements["option1"].checked ? 1 : 0);
  formForSend.append("optionSecond", form.elements["option2"].checked ? 1 : 0);
  let nUrl = new URL(url + "orders");
  nUrl.searchParams.append("api_key", api_Key);
  if (form.elements["time"].validity.valid) {
    try {
      event.target.setAttribute("type", "button");
      let modal = document.querySelector("#addTask");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      let response = await fetch(nUrl, {
        method: "POST",
        body: formForSend,
      });
      let data = await response.json();
      if (data.error) showAlert(data.error, "alert-danger");
      else showAlert("Application completed successfully", "alert-success");
    } catch (error) {
      showAlert(error.message, "alert-danger");
    }
  } else {
    event.target.setAttribute("type", "submit");
  }
}

window.onload = function () {
  downloadData();
  document.querySelector(".main-objects-list").onclick = clickMainOb;
  document.querySelector(".pagination").onclick = pageBtnHandler;
  document.querySelector(".search-btn").onclick = searchBtnHandler;
  document.querySelector(".search-field").oninput = searchFieldInput;
  document.querySelector(".btn-main-object").onclick = btnMainObjectClick;
  document.querySelector(".language-list").onclick = btnLanguageClick;
  document.querySelector(".search-btn-guides").onclick =
    searchGuidesWithFilters;
  document.querySelector("#customRange2").oninput = changeNumberOfPeople;
  document.querySelector(".checkout-route").onclick = checkoutRoute;
  document.querySelector("#selectLength").oninput = changeTotalPrice;
  document.querySelector("#time").oninput = changeTotalPrice;
  document.querySelector("#date").oninput = changeTotalPrice;
  document.querySelector("#option1").oninput = changeTotalPrice;
  document.querySelector("#option2").oninput = changeTotalPrice;
  document.querySelector(".create-btn").onclick = sendRequest;
};
