function validate()
{
    var firstname =  document.getElementById("first_name").value;
    var lastname =  document.getElementById("last_name").value;
    var email = document.getElementById("email").value;
    var pn = document.getElementById("phone_number").value;
    var age = document.getElementById("age").value;

    // information
    sessionStorage.setItem("first_name", firstname);
    sessionStorage.setItem("last_name", lastname);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("phone_number", pn);
    sessionStorage.setItem("age", age);

    // // // get data in the usual fashion-------------------
    // // occupation
    // var university = document.getElementById("university").checked;
    // var working = document.getElementById("working").checked;
    // var retired = document.getElementById("retired").checked;

    // //    check occupation
    // if (university == true)
    // {
    //     sessionStorage.setItem("occupation", "University");
    // }

    // if (working == true)
    // {
    //     sessionStorage.setItem("occupation", "Working");
    // }

    // if (retired == true)
    // {
    //     sessionStorage.setItem("occupation", "Retired");
    // }
    // // // --------------------------------------------------

    // get data using array
    var occupationArray = document.getElementById("radio_occupation").getElementsByTagName("input");

    for (var i = 0; i < occupationArray.length; i++)
    {
        if (occupationArray[i].checked ==  true) sessionStorage.occupation = occupationArray[i].value;
    }


    //   lane
    var top = document.getElementById("top").checked;
    var jungle = document.getElementById("jungle").checked;
    var mid = document.getElementById("mid").checked;
    var ad = document.getElementById("ad").checked;
    var sp = document.getElementById("sp").checked;

    sessionStorage.top = top;
    sessionStorage.jungle = jungle;
    sessionStorage.mid = mid;
    sessionStorage.ad = ad;
    sessionStorage.sp = sp;

    // chair
    sessionStorage.chair = document.getElementById("chair").value;


    // error message
    var er_mes = "";

    if (firstname.match("^[a-z A-Z]{1,30}$") == null)
    {
        er_mes += "Error: First Name ....... ";
    }
    
    if (lastname.match("^[a-z A-Z]{1,30}$") == null)
    {
        er_mes += "Error: Last Name ..... ";
    }

    if (email.match("^[a-zA-Z0-9]*@[a-z.A-Z]*$") == null)
    {
        er_mes += "Error: Mail ....... ";
    }

    if (pn.match("^8[0-9]{9,12}$") == null)
    {
        er_mes += "Error: Phone number ....... \n";
    }

    if (document.getElementById("university").checked == true && age >= 25)
    {
        er_mes += "Error: age ...........";
    }
 

    if (er_mes != "")
    {
        document.getElementById("error_mes").textContent = er_mes;
        return false;
    }
    else 
    {
        return true;
    }
    
}

function prefillData()
{
    // refill information
    document.getElementById("first_name").value = sessionStorage.first_name;
    document.getElementById("last_name").value = sessionStorage.last_name;
    document.getElementById("email").value = sessionStorage.email;
    document.getElementById("phone_number").value = sessionStorage.phone_number;
    document.getElementById("age").value = sessionStorage.age;

    // refill occupation
    switch (sessionStorage.occupation)
    {
        case "University":
            document.getElementById("university").checked = true;
            break;
        case "Working":
            document.getElementById("working").checked = true;
            break;
        case "Retired":
            document.getElementById("retired").checked = true;
            break;
    }

    // refill lane 
    if (sessionStorage.top == "true")
    {
        document.getElementById("top").checked = true ;
    }
    if (sessionStorage.jungle == "true")
    {
        document.getElementById("jungle").checked = true ;
    }
    if (sessionStorage.mid == "true")
    {
        document.getElementById("mid").checked = true ;
    }
    if (sessionStorage.ad == "true")
    {
        document.getElementById("ad").checked = true ;
    }
    // if (sessionStorage.sp == "true")
    // {
    //     document.getElementById("sp").checked = true ;
    // }
    document.getElementById("sp").checked = (sessionStorage.sp === 'true')

    // refill chair
    document.getElementById("chair").value = sessionStorage.chair;
}

function init()
{
    var  regForm = document.getElementById("registerForm");
    regForm.onsubmit = validate;
    if (sessionStorage.first_name != null)
    {
        prefillData();
    }
}

window.onload = init;