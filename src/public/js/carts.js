const emptyBtn = document.getElementById("empty-btn");
const deleteBtns = document.getElementsByClassName("del-btn");

emptyBtn?.addEventListener("click", async e => {
    const user = await getUser();
    const cid = user.cart;
    fetch(`/api/carts/${cid}`, {
        method: "DELETE"
    })
    .then(result => {
        if(result.status === 200) window.location.replace(`/carts/${cartId}`);
    })
})

for (const btn of deleteBtns) {
    btn.addEventListener("click", async e =>{
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

