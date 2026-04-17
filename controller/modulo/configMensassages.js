/*
    objetivo: arquivo responsavel pela padronização das mensagens e status code do projeto filme
    data: 17/04/2026
 
*/


const DEFAUT_MENSSAGENS = {
    api_descripition: 'API para controlar o objeto filmes',
    development: 'Nathan Proença de Luna',
    version: '1.0.4.26',
    status: Boolean,
    statusCode: Number,
    response: []
}

const ERROR_BAD_REQUEST = {
    status: false, 
    status_code: 400,
    menssage: 'não foi possivel acessar a requisição devido a erros de entrada de dados'
}

const SUCESS_CREATED_ITEM ={
    status:true,
    status_code:201,
    menssage: 'item inserido com sucesso!'
}

const ERRO_INTERNAL_SERVER_MODEL ={
    status: false,
    status_code: 500,
    menssage: 'não foi possivel processar o por erro do servidor'
}


module.exports ={
    DEFAUT_MENSSAGENS,
    ERROR_BAD_REQUEST,
    SUCESS_CREATED_ITEM
}