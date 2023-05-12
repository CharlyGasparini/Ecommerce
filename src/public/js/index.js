const socket = io();  // Instancia del socket del lado del cliente

const radioPost = document.getElementById("inlineRadio1"); // Captura del DOM radio button POST
const radioDelete = document.getElementById("inlineRadio2"); // Captura del DOM radio button DELETE
const form = document.getElementById("form");
let method = ""; // Objeto que se enviará al servidor desde el socket
// Evento que muestra el formulario para POST
radioPost.addEventListener("change", e => {
    method = e.target.value;
    form.innerHTML = 
    `
    <div class="row my-3">
        <div class="col">
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Title</span>
                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="title">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Price</span>
                <input type="number" step="0.01" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="price">
            </div>            
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Description</span>
                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="description">
            </div>
            </div>
        <div class="col">
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Code</span>
                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="code">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Stock</span>
                <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="stock">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">Category</span>
                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="category">
            </div>
        </div>
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
    `
})

// Evento que muestra el formulario para DELETE
radioDelete.addEventListener("change", e => {
    method = e.target.value;
    form.innerHTML = 
    `
    <div class="row my-3">
        <div class="col-6">
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">ID</span>
                <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="id">
            </div>
        </div>
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
    `
})

// Evento submit que envia los datos recopilados del form al servidor
form.addEventListener("submit", async e => {
    try {
        e.preventDefault();
        const inputs = document.getElementsByClassName("form-control");
        const product = {};
        for (const input of inputs) {
            product[input.name] = input.value;
            input.value = "";
        }
        if(method === "post"){
            socket.emit("post", product);
        } else {
            socket.emit("delete", product.id)
        }
    } catch (error) {
        console.log(error);
    }
})

// Recibe el listado de productos y lo muestra
socket.on("showProducts", data => {
    tbody.innerHTML = "";
    data.forEach(prod => {
        if(prod.status){
            tbody.innerHTML += `
            <tr>
            <td>${prod.id}</td>
            <td>${prod.title}</td>
            <td>$${prod.price}</td>
            <td>${prod.category}</td>
            <td>${prod.stock}</td>
            <td>${prod.code}</td>
            </tr> 
            `
        }
    });
})