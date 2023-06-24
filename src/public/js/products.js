const btns = document.getElementsByClassName("add-btn");

// Función que consulta con endpoint para obtener el cid de una cookie firmada
const getCid = async () => {
    const response = await fetch("/api/sessions/current", {
        method: "GET"
    })

    const user = await response.json();
    return user.cart;
}

// Evento de los botones que agregan productos al carrito
for (const btn of btns) {
    btn.addEventListener("click", async e => {
        e.preventDefault();
        const pid = btn.value;
        const cid = await getCid();

        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => {
            if(result.status === 200) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "El producto fue agregado al carrito",
                    icon: "success"
                })
            }
        })
    })
}