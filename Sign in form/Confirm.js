
function loadData()
{
    var name = document.getElementById("conf_name");
    var mail = document.getElementById("conf_mail");
    var phn = document.getElementById("conf_pn");
    var age2 = document.getElementById("conf_age");
    var occupation = document.getElementById("conf_occupation");
    var lane = document.getElementById("conf_lane");
    var chair = document.getElementById("conf_chair");
    var total_c = document.getElementById("conf_total");
    var discount = document.getElementById("discount");
    var total_r = document.getElementById("real_total");

    firstname = sessionStorage.getItem("first_name");
    lastname = sessionStorage.getItem("last_name");
    email = sessionStorage.getItem("email");
    ph = sessionStorage.getItem("phone_number");
    age = sessionStorage.getItem("age");
    occupation2 = sessionStorage.getItem("occupation");

    name.textContent = firstname + " " + lastname;
    mail.textContent = email + " ( verifying email ) ";
    phn.textContent = ph + "******";
    age2.textContent = age;
    occupation.textContent = occupation2 ;
    chair.textContent = sessionStorage.chair;

    // price 
    total = 0;
    total_dis = 0;
    num = 0 ;
    var price = [10,20,30,40,50];
    
    var yourLane = "";
    if (sessionStorage.top == "true")
    {
        yourLane += "top, ";
        total += price[0];
        num ++;
    }
    if (sessionStorage.jungle == "true")
    {
        yourLane += "jungle, ";
        total += price[1];
        num ++;
    }
    if (sessionStorage.mid == "true")
    {
        yourLane += "mid, ";
        total += price[2];
        num ++;
    }
    if (sessionStorage.ad == "true")
    {
        yourLane += "ad, ";
        total += price[3];
        num ++;
    }
    if (sessionStorage.sp == "true")
    {
        yourLane += "sp, ";
        total += price[4];
        num ++;
    }
    lane.textContent = yourLane.substring(0, yourLane.length -2) ;
    
    switch (num)
    {
        case 0 :
        case 1 :
        case 2 :
            discount.textContent = "0";
            total_dis = 0;
            break;
        case 3 :
            discount.textContent = "20";
            total_dis = total*0.2;
            break;
        case 4 :
            discount.textContent = "30";
            total_dis = total*0.3;
            break;
        case 5 :
            discount.textContent = "40";
            total_dis = total*0.4;
            break;
    }

    total_c.textContent = total;
    total_r.textContent = total - total_dis;
    
}

function cancelbutton()
{
    window.location = "WD_1.html";
}


function init()
{
    loadData();
    var cancel = document.getElementById("can_but");
    cancel.onclick = cancelbutton;
}


window.onload = init;