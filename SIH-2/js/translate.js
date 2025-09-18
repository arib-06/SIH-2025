async function translateText(q,target) {
    const response=await fetch('http://localhost:5000/translate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            q,
            target
        })
    })
    const data=await response.json()
    return data.data.translations[0].translatedText
}