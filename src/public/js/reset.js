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
            const error = await result.json();
            if(result.status === 200){
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "Se envió un correo a su email",
                    icon: "success"
                })
            } else if(error.error.name === "UserNotFound") {

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    title: "El email ingresado no pertenece a ningun usuario registrado",
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
            title: "Debe ingresar su email",
            icon: "error"
        })
    }
})