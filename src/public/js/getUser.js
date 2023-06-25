const getUser = async () => {
    const response = await fetch("/api/sessions/current", {
        method: "GET"
    })

    const data = await response.json();
    return data.payload;
}