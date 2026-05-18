function login()
{
    let username =
    document.getElementById("username").value

    if(username=="")
    {
        alert("Please enter your name")
        return
    }

    localStorage.setItem(
        "username",
        username
    )

    window.location.href = "tracker.html"
}