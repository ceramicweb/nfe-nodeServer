var app = require('express')();
var http = require('http').Server(app);


http.listen(3000, function () {
  console.log('listening on port 3000');
});

var io = require('socket.io').listen(http);

var clients = {};

app.get('/', function (req, res) {
  res.send('server is running');
});

//ENABLE CORS
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

io.sockets.on("connection", function (client) {
  console.log("Conected");
  client.send("hello");

  client.on("enviarNotaFiscal", function (nota) {


    /*
        As orientacoes a seguir foram extraidas do site do NPMJS: https://www.npmjs.com/package/xmlhttprequest
        Here's how to include the module in your project and use as the browser-based XHR object.
        Note: use the lowercase string "xmlhttprequest" in your require(). On case-sensitive systems (eg Linux) using uppercase letters won't work.
    */
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var request = new XMLHttpRequest();

    var token = "2ZgcIAqr7gHAXYRX9RzVkEUUL808IAEN";

    // Substituir pela sua identificação interna da nota.
    var ref = "12345";

    /*
    Para ambiente de producao use a URL abaixo:
    "https://api.focusnfe.com.br"
    */
    var url = "https://homologacao.focusnfe.com.br/v2/nfe?ref=" + ref;

    /*
    Use o valor 'false', como terceiro parametro para que a requisicao aguarde a resposta da API
    Passamos o token como quarto parametro deste metodo, como autenticador do HTTP Basic Authentication.
    */
    request.open('POST', url, false, token);
    console.log(nota.nota.emissor_cnpj)
    var cnpjEmissor = nota.nota.emissor_cnpj.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    console.log(cnpjEmissor)
    var nfe = {
      "natureza_operacao": "Remessa",
      "data_emissao": nota.nota.dataEmissao,
      "data_entrada_saida": "2018-03-21T11:00:00",
      "tipo_documento": "1",
      "finalidade_emissao": "1",
      "cnpj_emitente": cnpjEmissor.toString(),
      "nome_emitente": nota.nota.emissor_razao,
      "nome_fantasia_emitente": nota.nota.emissor_nome,
      "logradouro_emitente": "R. Padre Natal Pigato",
      "numero_emitente": "100",
      "bairro_emitente": "Santa Felicidade",
      "municipio_emitente": "Curitiba",
      "uf_emitente": "PR",
      "cep_emitente": "82320030",
      "inscricao_estadual_emitente": "200903608",
      "nome_destinatario": "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
      "cpf_destinatario": "51966818092",
      "telefone_destinatario": "1196185555",
      "logradouro_destinatario": "Rua S\u00e3o Janu\u00e1rio",
      "numero_destinatario": "99",
      "bairro_destinatario": "Crespo",
      "municipio_destinatario": "Manaus",
      "uf_destinatario": "AM",
      "pais_destinatario": "Brasil",
      "cep_destinatario": "69073178",
      "valor_frete": "0.0",
      "valor_seguro": "0",
      "valor_total": "47.23",
      "valor_produtos": "47.23",
      "modalidade_frete": "0",
      "items": [
        {
          "numero_item": "1",
          "codigo_produto": "1232",
          "descricao": "Cartu00f5es de Visita",
          "cfop": "6923",
          "unidade_comercial": "un",
          "quantidade_comercial": "100",
          "valor_unitario_comercial": "0.4723",
          "valor_unitario_tributavel": "0.4723",
          "unidade_tributavel": "un",
          "codigo_ncm": "49111090",
          "quantidade_tributavel": "100",
          "valor_bruto": "47.23",
          "icms_situacao_tributaria": "400",
          "icms_origem": "0",
          "pis_situacao_tributaria": "07",
          "cofins_situacao_tributaria": "07"
        }
      ]
    };

    // Aqui fazermos a serializacao do JSON com os dados da nota e enviamos atraves do metodo usado.
    request.send(JSON.stringify(nfe));
    console.log(nfe)
    // Sua aplicacao tera que ser capaz de tratar as respostas da API.
    console.log("HTTP code: " + request.status);
    console.log("Corpo: " + request.responseText);



    // console.log(nota)
    // console.log("Enviando nota");
    // client.emit("nota sendo enviada");
    // var webdanfe = require('webdanfe'),
    //   fs = require('fs'),
    //   xml = nota.nota.xml

    // webdanfe.gerarDanfe(xml, function (err, pdf) {
    //   if (err) {
    //     throw err;
    //   }

    //   fs.writeFileSync('danfe.pdf', pdf, {
    //     encoding: 'binary'
    //   });
    // });
  });

  client.on("disconnect", function () {
    console.log("Disconnected");
    client.emit("bye");
  });

});



// client.on("disconnect", function(){
//   console.log("Disconnected");
//     io.emit("update", clients[client.id] + " has left the server.");
//     delete clients[client.id];
// });
