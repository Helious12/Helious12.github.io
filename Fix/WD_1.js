function validate()
{
    var name =  document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var site = document.getElementById("site").value;
    var msg = document.getElementById("message").value;

    // information
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("site", site);
    sessionStorage.setItem("msg", msg);


    // error message
    var er_mes = "";

    if (name.match("^[a-z A-Z]{1,30}$") == null)
    {
        er_mes += "Error: Name ....... ";
    }

    if (email.match("^[a-zA-Z0-9]*@[a-z.A-Z]*$") == null)
    {
        er_mes += "Error: Mail ....... ";
    }

    if (er_mes != "")
    {
        document.getElementById("error_mes").textContent = er_mes;
        alert("OH!!! Looks like you went wrong somewhere")
        return false;
    }
    else 
    {
        return true;
    }
    
}

console.log("running");

function prefillData()
{
    // refill information
    document.getElementById("name").value = sessionStorage.name;
    document.getElementById("email").value = sessionStorage.email;
    document.getElementById("site").value = sessionStorage.site;
    document.getElementById("message").value = sessionStorage.msg;

}

function init()
{
    var  regForm = document.getElementById("registerForm");
    regForm.onsubmit = validate;
    if (sessionStorage.name != null)
    {
        prefillData();
        alert("Select the section you want to edit");
    }
    else
    {
        alert("Welcome to our site");
    }
}

window.onload = init;