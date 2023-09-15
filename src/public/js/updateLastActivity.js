
const updateLastActivity = async () => {
    const user = await getUser();
    const timeNow = new Date().getTime();
    const lastActivity = {user: user.email, time: timeNow};
    await fetch("/api/sessions/activity", {
        method: "POST",
        body: JSON.stringify(lastActivity),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}