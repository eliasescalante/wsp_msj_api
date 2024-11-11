
const numero = document.getElementById("number"); 
const mensaje = document.getElementById("message"); 
const btnEnviar = document.getElementById("sendMessage"); 
const statusDiv = document.getElementById("status"); 

btnEnviar.addEventListener("click", async () => {
    let numeroDestino = numero.value.trim(); 
    let mensajeDestino = mensaje.value.trim();
    

    if(!numeroDestino || !mensajeDestino) {
        statusDiv.textContent = "Por favor, completa los campos, no me obligues a enojarme"; 
        return; 
    }

    try {
        //Enviamos los datos al backend: 
        const response = await fetch("http://localhost:8080/send-message", {
            method: "POST", 
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({numeroDestino, mensajeDestino})
        })

        const result = await response.json(); 

        if (response.ok) {
            statusDiv.textContent = "Mensaje enviado con éxito, ser de luz";
        } else {
            statusDiv.textContent = "Tenemos un error terrible"; 
        }
    } catch (error) {
        statusDiv.textContent = "Error al enviar el mensaje " + error; 
    }
})