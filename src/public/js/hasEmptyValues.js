const hasEmptyValues = (formData) => {
    for(const [key, value] of formData) {
        if(!value) return true
    }
    return false
}