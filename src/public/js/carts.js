const emptyBtn = document.getElementById("empty-btn");
const deleteBtns = document.getElementsByClassName("del-btn");
const purchaseBtn = document.getElementById("purchase-btn");

emptyBtn?.addEventListener("click", async e => {
    await updateLastActivity();
    const user = await getUser();
    const cid = user.cart;
    fetch(`/api/carts/${cid}`, {
        method: "DELETE"
    })
    .then(result => {
        if(result.status === 200) window.location.replace(`/carts/${cid}`);
    })
})

for (const btn of deleteBtns) {
    btn.addEventListener("click", async e =>{
        await updateLastActivity();
        const user = await getUser();
        const row = btn.parentElement.parentElement;
        const td = row.children[0];
        const pid = td.textContent;
        const cid = user.cart;
        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "DELETE"
        })
        .then(result => {
            if(result.status === 200) window.location.replace(`/carts/${cid}`);
        })
    })
}

purchaseBtn?.addEventListener("click", async e => {
    await updateLastActivity();
    const user = await getUser();
    const cid = user.cart;
    const resp = await fetch(`/api/carts/${cid}/purchase`);
    const data = await resp.json();
    if(resp.status === 200){
        Swal.fire({
            position: "center",
            showConfirmButton: true,
            title: "La compra se ha realizado con éxito",
            text: "Se envió un mail de confirmación de la compra",
            icon: "success"
        })
        .then(result => {
            if(result.isConfirmed) {
                window.location.replace(`/tickets`);
            }
        })
    } else {
        Swal.fire({
            position: "center",
            showConfirmButton: true,
            title: "Compra no realizada",
            text: data.error.message,
            icon: "error"
        })
        .then(result => {
            if(result.isConfirmed) {
                window.location.replace(`/carts/${cid}`);
            }
        })
    }
})

