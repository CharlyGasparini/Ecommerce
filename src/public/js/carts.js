const emptyBtn = document.getElementById("empty-btn");
const deleteBtns = document.getElementsByClassName("del-btn");


emptyBtn.addEventListener("click", e => {
    fetch("/api/carts/646b6b2e019903b533c9eae5", {
        method: "DELETE"
    })
})

for (const btn of deleteBtns) {
    btn.addEventListener("click", e =>{
        const row = btn.parentElement.parentElement;
        const td = row.children[0];
        const pid = td.textContent;
        fetch(`/api/carts/646b6b2e019903b533c9eae5/products/${pid}`, {
            method: "DELETE"
        })
    })
}

