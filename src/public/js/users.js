const delBtn = document.getElementById("del-btn");

delBtn.addEventListener("click", async e => {
    const request = await fetch("/api/users/deleteInactive", {
        method: "DELETE"
    })
    if(request.status === 200) {
        const response = await request.json();
        Swal.fire({
            position: "center",
            showConfirmButton: true,
            title: `Se borraron ${response.data} usuario/s`,
            icon: "error"
        })
        .then(result => {
            if(result.isConfirmed) {
                window.location.replace("/users")
            }
        })
    } else {
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            title: "No hay usuarios inactivos para borrar",
            icon: "error"
        })
    }
})