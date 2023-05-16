const socket = io(); // Instancia del socket del lado del cliente

const chatBox = document.getElementById("chatBox");
let user;

Swal.fire({
    title: "Identificate",
    input: "email",
    text: "Ingresa tu email para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas colocar tu email para comenzar a chatear"
    },
    allowOutsideClick: false,
    allowEscapeKey: false
})
.then(result => {
    user = result.value;
    socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", e => {
    if(e.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

socket.on("messageLogs", data => {
    let logs = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(msg => {
        messages += `${msg.user} dice: ${msg.message}<br/>`;
    });
    logs.innerHTML = messages;
})

socket.on("newUserConnected", data => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})
