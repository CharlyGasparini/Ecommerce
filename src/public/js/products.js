const btns = document.getElementsByClassName("add-btn");

// Evento de los botones que agregan productos al carrito
for (const btn of btns) {
    btn.addEventListener("click", async e => {
        e.preventDefault();
        const user = await getUser();
        const pid = btn.value;
        const cid = user.cart;

        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => {
            if(result.status === 200){
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "Producto agregado al carrito",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "El producto no pudo ser agregado",
                    icon: "error"
                })
            }
        })
    })
}