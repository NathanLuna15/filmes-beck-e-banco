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
    let ContentType = request.headers['content-type']

    let result = await controllerFilme.inserirNovoFilme(dados,ContentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/v1/senai/locadora/filme', async function(request, response){
    let result = await controllerFilme.listarFilme()

    response.status(result.status_code)
    response.json(result)
}) 

app.get('/v1/senai/locadora/filme/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerFilme.buscarFilme(id)
    
    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/locadora/filme/:id', bodyParserJSON, async function(request, response){
    let ContentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body

    // chama a funcao para atualizar o filme devemos encaminhar as 3 variaveis na mesma sequencia que a funcao foi criada na controller
    let result = await controllerFilme.atualizarFilme(dados, id, ContentType)

    console.log(result);
    

    response.status(result.status_code)
    
    response.json(result)
})

app.listen(8080, function(){
    console.log("API aguardando novas requisiçoes...")
})
