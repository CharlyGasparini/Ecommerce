const form = document.getElementById("register-form");

const hasEmptyValues = (formData) => {
    for(const [key, value] of formData) {
        if(!value) return true
    }
    return false
}

form.addEventListener("submit", e =>{
    e.preventDefault();
    const data = new FormData(form);
    const isEmpty = hasEmptyValues(data)
    if(!isEmpty){
        const obj = {};
        data.forEach((value, key) => obj[key]= value);
        fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => {
            if(result.status === 200) window.location.replace("/login");
        })
    } else {
        console.log("Los campos no pueden quedar vacios")
    }
})