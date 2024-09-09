let historico = [];
document.addEventListener('DOMContentLoaded',function() {

    document.getElementById('user-input').addEventListener('keypress', function(event){
        if (event.key == 'Enter'){
            requisicao();
        }
    });
    
    document.getElementById('send-button').addEventListener('click', requisicao);
})

async function requisicao(){
    event.preventDefault(); 
    event.stopPropagation();
    console.log('Botão clicado!');
        const userInput = document.getElementById('user-input').value;
        document.getElementById('user-input').value = '';
        const chatBox = document.getElementById('chat-box');

        let imagem = document.getElementById('imagem').files[0];
        console.log('Imagem:', imagem);
        console.log('User Input:', userInput);

        
        if (userInput.trim() === '') return;
        


        chatBox.innerHTML += `<section id="balaoDeTexto" class="bg-secondary-subtle ms-auto p-3 me-2 w-50 square flex-grow-1 text-wrap">${userInput}</section>
            <section class="text-end p-2"><strong>Você:</strong></section><br>`;
    if (imagem){
        chatBox.innerHTML += `<section id="balaoDeTexto" class="bg-secondary-subtle ms-auto p-3 me-2 w-50 square flex-grow-1 text-wrap">"Imagem enviada!"</section>
        <section class="text-end p-2"><strong>Você:</strong></section><br>`;
    }

        historico.push({
            role: 'user',
                parts: [{ text: userInput }]
            });
            
            

        let formData = new FormData();
        formData.append('question', userInput);
        formData.append('imagem', imagem);  // Adicionando a imagem ao FormData
        formData.append('historico', JSON.stringify(historico));


        try {
            const response = await fetch('https://chat-bot-5ro3.onrender.com/ask-gemini', {
                method: 'POST',
                body: formData
            });
    
            const data = await response.json();
            chatBox.innerHTML += `<section id="balaoDeTexto" class="bg-secondary-subtle ms-0 p-3 me-2 w-50 square flex-grow-1 text-wrap">${data.answer}</section>
            <strong>Gemini:</strong><br>`;

            historico.push({
                role: 'model',
                parts: [{ text: data.answer }]
            });
            
        } catch (error) {
            chatBox.innerHTML += `<div><strong>Erro:</strong> Não foi possível conectar ao chatbot</div>`;
        }
    chatBox.scrollTop = chatBox.scrollHeight;
}
