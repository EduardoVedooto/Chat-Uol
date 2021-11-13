let nome = prompt("Qual seu nome?");
const dados = [];
let entradaSaida = "";
let mensagemNormal = "";
let mensagemPrivada = "";
let mensagemCarregadas = "";
let textoEnviar = "";


login();

function login() {
    const envio = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants ', nome);
    envio.then(enviado);
    envio.catch(erro);
}



function enviado(resposta) {
    if (resposta.response.status != 200) {
        erro();
    } else {

        buscarMensagens(setInterval(online, 5000));
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
    historico.then(esperarMensagens);
    historico.catch(historicoErro);
}

function esperarMensagens(resposta) {
    mensagemCarregadas = resposta.data;
    historicoCarregado();
}

function historicoCarregado() {
    const elementoQueQueroQueApareca = document.querySelector('.mensagens');
    elementoQueQueroQueApareca.scrollIntoView();

    for (let i = 0; i < mensagemCarregadas.length; i++) {

        let de = mensagemCarregadas[i].from;
        let para = mensagemCarregadas[i].to;
        let texto = mensagemCarregadas[i].text;
        let horario = mensagemCarregadas[i].time;
        let tipo = mensagemCarregadas[i].type;


        if (tipo === "status") {


            entradaSaida = `<div data-identifier="message" class="entradaSaida">\n<h1>${horario}</h1>\n<h2>${nome}</h2><h3>${texto}</h3>`;
            document.querySelector(".mensagens").innerHTML = entradaSaida;

        } else if (tipo === "message") {


            mensagemNormal = `<div data-identifier="message" class="mensagemNormal">\n<h1>${horario}</h1>\n<h2>${de}</h2><h4>${para}<h3>${texto}</h3>`;
            document.querySelector(".mensagens").innerHTML = mensagemNormal;

        } else if (tipo === "private_message") {
            if (nome === para) {

                mensagemPrivada = `<div data-identifier="message" class="mensagemPrivada">\n<h1>${horario}</h1>\n<h2>${de}</h2><h4>${para}<h3>${texto}</h3>`;
                document.querySelector(".mensagens").innerHTML = mensagemPrivada;
            }
        }
    }

    function enviarMensagem() {

        let botao = document.querySelector(".barraTexto");

        textoEnviar = botao.value;

        let msg = {
            from: nome,
            to: "Todos",
            text: textoEnviar,
            type: "message"

        }
        let promessa = "";
        promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", msg);
        promessa.then(limparMsg);
        promessa.catch(reload);

    }

    function reload() {
        window.location.reload()
    }

    function limparMsg() {
        let caixaDeTexto = document.querySelector(".barraTexto")
        caixaDeTexto.value = "";
    }
}