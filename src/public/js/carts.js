const emptyBtn = document.getElementById("empty-btn");
const deleteBtns = document.getElementsByClassName("del-btn");
const cartId = document.cookie.split("=")[1];

emptyBtn?.addEventListener("click", e => {
    fetch(`/api/carts/${cartId}`, {
        method: "DELETE"
    })
    .then(result => {
        if(result.status === 200) window.location.replace(`/carts/${cartId}`);
    })
})

for (const btn of deleteBtns) {
    btn.addEventListener("click", e =>{
        const row = btn.parentElement.parentElement;
        const td = row.children[0];
        const pid = td.textContent;
        fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: "DELETE"
        })
        .then(result => {
            if(result.status === 200) window.location.replace(`/carts/${cartId}`);
        })
    })
}

