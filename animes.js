let historico = [];
document.addEventListener('DOMContentLoaded', function () {
    historico.push({
        role: 'user',
        parts: [{ text: 'assuma que você é uma ia especializada em animes, você não deve tratar de outros assuntos não relacionado a animes, a partir das proximas mensagens responda apenas com o escopo de animes.' }]
    });

    document.getElementById('user-input').addEventListener('keypress', function (event) {
        if (event.key == 'Enter') {
            requisicao();
        }
    });

    document.getElementById('send-button').addEventListener('click', requisicao);
});

async function requisicao() {
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

    historico.push({
        role: 'user',
        parts: [{ text: userInput }]
    });

    let formData = new FormData();
    formData.append('question', userInput);
    formData.append('imagem', imagem);  // Adicionando a imagem ao FormData
    formData.append('historico', JSON.stringify(historico));

    try {
        const response = await axios.post('http://localhost:3000/ask-gemini', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = response.data;
        chatBox.innerHTML += `<section id="balaoDeTexto" class="bg-secondary-subtle ms-0 p-3 me-2 w-50 square flex-grow-1 text-wrap">${data.answer}</section>
        <strong>Gemini:</strong><br>`;

        historico.push({
            role: 'model',
            parts: [{ text: data.answer }]
        });

    } catch (error) {
        console.error('Erro:', error);
        chatBox.innerHTML += `<div><strong>Erro:</strong> Não foi possível conectar ao chatbot</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
