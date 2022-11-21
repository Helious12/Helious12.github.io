
function loadData()
{
    var name2 = document.getElementById("conf_name");
    var mail2 = document.getElementById("conf_mail");
    var site2 = document.getElementById("conf_site");
    var msg2 = document.getElementById("conf_message");

    name = sessionStorage.getItem("name");
    email = sessionStorage.getItem("email");
    site = sessionStorage.getItem("site");
    msg = sessionStorage.getItem("msg");

    
    console.log(name);
    console.log(email);
    console.log(site);
    console.log(msg);
    console.log("running");

    name2.textContent = name;
    mail2.textContent = email + " ( verifying email ) ";
    site2.textContent = site;
    msg2.textContent = msg;
    
}

function cancelbutton()
{
    window.location = "./WD_1.html";
}


function init()
{
    loadData();
    var cancel = document.getElementById("can_but");
    cancel.onclick = cancelbutton;
}


window.onload = init;