const chatEnv = async () => {
    const socket = io(); // Instancia del socket del lado del cliente
    const chatBox = document.getElementById("chatBox");
    const user = await getUser();
    const email = user.email;

    socket.emit("authenticated", email);
    
    chatBox.addEventListener("keyup", e => {
        if(e.key === "Enter"){
            if(chatBox.value.trim().length > 0){
                socket.emit("message", {user: email, message: chatBox.value});
                chatBox.value = "";
            }
        }
    })

    socket.on("messageLogs", data => {
        let logs = document.getElementById("messageLogs");
        let messages = "";
        data.forEach(msg => {
            messages += `<p><strong>${msg.user} dice:</strong> ${msg.message}</p>`;
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

}

chatEnv();

