const inactDelBtn = document.getElementById("InactDel-btn");
const deleteBtns = document.getElementsByClassName("del-btn");
const upgradeBtns = document.getElementsByClassName("upgrade-btn");

inactDelBtn.addEventListener("click", async e => {
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

for (const btn of deleteBtns) {
    btn.addEventListener("click", async e =>{
        const row = btn.parentElement.parentElement;
        const td = row.children[3];
        const email = td.textContent;
        const request = await fetch(`/api/users/delete`, {
            method: "DELETE",
            body: JSON.stringify({email}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(request.status === 200) {
            window.location.replace(`/users`);
        } 
    })
}

for(const btn of upgradeBtns) {
    const row = btn.parentElement.parentElement;
    const td = row.children[4];
    const role = td.textContent;
    
    if(role === "user") {
        btn.textContent = "a Premium";
    } else {
        btn.textContent = "a Basic"
    }

    btn.addEventListener("click", async e => {
        const td = row.children[3];
        email = td.textContent;
        const request = await fetch(`/api/users/premium`, {
            method: "POST",
            body: JSON.stringify({email}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(request.status === 200) {
            window.location.replace("/users");
        }
    })
}