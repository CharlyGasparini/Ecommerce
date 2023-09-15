const productsEnv = async () => {
    const form = document.getElementById("form");
    const statusBtns = document.getElementsByClassName("status");
    const btns = document.getElementsByClassName("add-btn");
    const upgradeBtn = document.getElementById("upgrade-btn");

    // Evento submit que envia los datos recopilados del form al servidor
    form?.addEventListener("submit", async e => {
        try {
            await updateLastActivity();
            e.preventDefault();
            const data = new FormData(form);
            const isEmpty = hasEmptyValues(data);
            if(!isEmpty){
                const obj = {thumbnails: []};
                data.forEach((value, key) => obj[key]= value);
                fetch("/api/products", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(async result => {
                    const res = await result.json();
                    if(result.status === 200){
                        window.location.replace("/products");
                    } else{
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500,
                            title: `${res.message}`,
                            icon: "error"
                        })
                    }
                })
            } else{
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    title: "No puede haber campos vacios",
                    icon: "error"
                })
            }
        } catch (error) {
            console.log(error);
        }
    })
    
    // Evento de los botones que eliminan productos del stock
    for (const btn of statusBtns) {
        btn?.addEventListener("click", async e => {
            try {
                await updateLastActivity();
                e.preventDefault();
                const pid = btn.value;

                fetch(`api/products/${pid}`, {
                    method: "DELETE"
                })
                .then(async result => {
                    const data = await result.json();
                    if(result.status === 200){
                        window.location.replace("/products");
                    } else{
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500,
                            title: `${data.error.message}`,
                            icon: "error"
                        })
                    }
                })
            } catch (error) {
                console.log(error);
            }
        })
    }

    // Evento de los botones que agregan productos al carrito
    for (const btn of btns) {
        btn?.addEventListener("click", async e => {
            try {
                await updateLastActivity();
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
                .then(async result => {
                    const data = await result.json();
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
                            title: data.error.message,
                            icon: "error"
                        })
                    }
                })
            } catch (error) {
                console.log(error);
            }
        })
    }

    upgradeBtn.addEventListener("click", async e => {
        const user = await getUser();
        const email = user.email;
        const request = await fetch(`/api/users/premium`, {
            method: "POST",
            body: JSON.stringify({email}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(request.status === 200) {
            window.location.replace("/products");
        }
    })
}

productsEnv();


