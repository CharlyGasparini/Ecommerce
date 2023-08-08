const form = document.getElementById("form-restore");

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const isEmpty = hasEmptyValues(data);
    if(!isEmpty){
        if(data.get("password") === data.get("password2")){
            const password = data.get("password");
            fetch("/api/sessions/changePassword", {
                method: "POST",
                body: JSON.stringify({password}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async result => {
                const error = await result.json();

                if(result.status === 200){
                    Swal.fire({
                        position: "center",
                        showConfirmButton: true,
                        title: "La contraseña ha sido restaurada",
                        icon: "success"
                    })
                    .then(result => {
                        if(result.isConfirmed) {
                            window.location.replace(`/login`);
                        }
                    })
                } 
                
                if(error.error.name === "SamePassword") {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500,
                        title: "Debe ingresar una contraseña distinta",
                        icon: "error"
                    })
                } 
            })
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                title: "Las contraseñas ingresadas deben ser iguales",
                icon: "error"
            })
        }
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