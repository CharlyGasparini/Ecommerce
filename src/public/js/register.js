const form = document.getElementById("register-form");

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
        .then(async result => {
            const res = await result.json();
            if(result.status === 200){
                window.location.replace("/login");
            } 
            else{
                Swal.fire({
                    toast: true,
                    position: "center",
                    showConfirmButton: false,
                    timer: 1500,
                    title: `${res.message}`,
                    icon: "error"
                })
            }
        })
    } else {
        Swal.fire({
            toast: true,
            position: "center",
            showConfirmButton: false,
            timer: 1500,
            title: "No puede haber campos vacios",
            icon: "error"
        })
    }
})