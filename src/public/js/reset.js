const form = document.getElementById("form-restore");

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const isEmpty = hasEmptyValues(data);
    if(!isEmpty){
        const obj = {};
        data.forEach((value, key) => obj[key]= value);
        fetch("/api/sessions/reset", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async result => {
            if(result.status === 200){
                window.location.replace("/login");
            } 
        })
    } else{
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