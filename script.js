let nome = prompt("Qual seu nome?");
const dados = [];
let entradaSaida = "";
let mensagemNormal = "";
let mensagemPrivada = "";

function login() {
    const envio = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants ', nome);
    envio.then(enviado);
    envio.catch(erro);
}

function enviado(resposta) {
    if (resposta.data.status != 200) {
        erro();
    } else {
        buscarMensagens();
        //roda o programa
        // inserir aqui o buscarmensagens
        setInterval(online, 5000);
    }
}

function erro(resposta) {
    alert("Usuario já existe, escolha outro");
    nome = prompt("Qual o novo nome?");
    login();
}

function online() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', nome);
}

function buscarMensagens() {
    const historico = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    historico.then(historicoCarregado);
    historico.catch(historicoErro);
}

function historicoCarregado(mensagem) {
    const elementoQueQueroQueApareca = document.querySelector('.mensagens');
    elementoQueQueroQueApareca.scrollIntoView();

    if (mensagem.data.type === "status") {
        const horario = mensagem.data.time;
        const nome = mensagem.data.from;
        const texto = mensagem.data.text;

        entradaSaida = `<div data-identifier="message" class="entradaSaida">\n<h1>${horario}</h1>\n<h2>${nome}</h2><h3>${texto}</h3>`;
        document.querySelector(".mensagens").innerHTML = entradaSaida;

    } else if (mensagem.data.type === "message") {
        const horario = mensagem.data.time;
        const de = mensagem.data.from;
        const para = mensagem.data.to;
        const texto = mensagem.data.text;

        mensagemNormal = `<div data-identifier="message" class="mensagemNormal">\n<h1>${horario}</h1>\n<h2>${de}</h2><h4>${para}<h3>${texto}</h3>`;
        document.querySelector(".mensagens").innerHTML = mensagemNormal;

    } else if (mensagem.data.type === "private_message") {
        if (nome === mensagem.data.to) {
            const horario = mensagem.data.time;
            const de = mensagem.data.from;
            const para = mensagem.data.to;
            const texto = mensagem.data.text;

            mensagemPrivada = `<div data-identifier="message" class="mensagemPrivada">\n<h1>${horario}</h1>\n<h2>${de}</h2><h4>${para}<h3>${texto}</h3>`;
            document.querySelector(".mensagens").innerHTML = mensagemPrivada;
        }
    }

    function enviarMensagem() {
        //pegar o nome e enviar como from, o conteudo da mensagem como text, o type como message e definir o to como todos
        //usar o post para enviar para o servidor 

        // - Caso o servidor responda com sucesso, você deve obter novamente as mensagens do servidor e atualizar o chat
        // - Caso o servidor responda com erro, significa que esse usuário não está mais na sala e a página deve ser atualizada (e com isso voltando pra etapa de pedir o nome)

        // **Dica**: experimente usar `window.location.reload()`
    }
}