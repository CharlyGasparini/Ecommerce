const btns = document.getElementsByClassName("add-btn");

for (const btn of btns) {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const pid = btn.value;
        const cid = document.cookie.split("=")[1];

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