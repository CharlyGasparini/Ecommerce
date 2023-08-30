const getUser = async () => {
    const data = await fetch("/api/sessions/current");
    const user = await data.json();
    return user.data;
}