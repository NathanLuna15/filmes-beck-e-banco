const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')

// permite a utilização de JSON
const bodyParserJSON = bodyParser.json()

const app = express()

const corsOpitions = {
    origin: ["*"], //configuração  de origem da requisicão (IP ou dominio)
    methods: "GET, POST, PUT, DELETE, OPTIONS", //configiração dos verbos que serão utilizado na API
    allowedHeaders: ["Content-type", "Authorization"] //configuração de permossoes
                    //tipo de dado   //autorização de acesso
}

// aplica as configurações do cors no app (EXPRES)
app.use(cors(corsOpitions))

const controllerFilme = require('./controller/filme/controller_filmes.js')

//EndPoints
app.post('/v1/senai/locadora/filme',bodyParserJSON, async function(request, response){
    let dados = request.body
    let result = await controllerFilme.inserirNovoFilme(dados)

    response.status(result.status_code)
    response.json(result)
})

app.listen(8080, function(){
    console.log("API aguardando novas requisiçoes...")
})