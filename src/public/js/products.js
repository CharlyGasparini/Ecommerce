const btns = document.getElementsByClassName("add-btn");

// Función que consulta con endpoint para obtener el cid de una cookie firmada
const getCid = async () => {
    const response = await fetch("/api/sessions/current", {
        method: "GET"
    })

    const data = await response.json();

    return data.payload.cartId
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
            if(result.status === 200) window.location.replace(`/carts/${cid}`);
        })
    })
}