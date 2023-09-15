const form = document.getElementById("form-login");

form.addEventListener("submit", e =>{
    e.preventDefault();
    const data = new FormData(form);
    const isEmpty = hasEmptyValues(data);
    if(!isEmpty){
        const obj = {};
        data.forEach((value, key) => obj[key]= value);
        fetch("/api/sessions/login", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async result => {
            if(result.status === 200){
                await updateLastActivity();
                window.location.replace("/products");
            } else{
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "Credenciales inválidas",
                    icon: "error"
                })
            }
        })
    } else{
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            title: "No puede haber campos vacios",
            icon: "error"
        })
    }
})