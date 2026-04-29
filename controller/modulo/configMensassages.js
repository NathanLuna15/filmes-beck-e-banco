/*
    objetivo: arquivo responsavel pela padronização das mensagens e status code do projeto filme
    data: 17/04/2026
 
*/


const DEFAULT_MESSAGE = {
    api_description: 'API para controlar o projeto de Filmes',
    development: 'Nathan proença de luna',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

//Mensagens de ERRO do projeto de filmes
const ERROR_BAD_REQUEST = {
    status: false,
    status_code: 400,
    message: 'Não foi possível processar a requisição devido a erros de entrada de dados.'
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]'
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: 'Não foi possível processar a requisição, pois o formato de dados encaminhado não é suportado pelo servidor, apenas deve ser utilizado JSON.'
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: 'Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]'
}

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: 'Item inserido com sucesso!'
}
const ERRO_NOT_FONDI = {
    status: false,
    status_code: 404,
    message: 'não foram encontrado para retorno para retorno'
}

const SUCCESS_RESPOSE ={
    status: true,
    status_code: 200,
}

const SUCCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'item atualizado com sucesso?'
}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERRO_NOT_FONDI,
    SUCCESS_RESPOSE,
    SUCCESS_UPDATE_ITEM
}