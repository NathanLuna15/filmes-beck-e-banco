/*
    obijetivo: arquivo responsavel pela validação, tratamento de dados e malipulação para realizar o CRUD de filmes
    data: 17/04/2026
    autor: nathan 
    versão: 1.0
*/

//inporte do arquivo de comfigurações de mensagens do projeto
const mensagens = require('../modulo/configMensassages.js')
//
const filmeDAO = require('../../model/DAO/filme/filme.js')

const validarDados = async function (filme) {
    // cria uma copia do JSON do arquivo de configuração da mensagens
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.sinopse == '' || filme.sinopse == null || filme.sinopse == undefined) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[SINOPSE]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa > 255) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[CAPA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.data_lancamento == "" || filme.data_lancamento == null || filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DATA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.duracao == "" || filme.duracao == null || filme.duracao == undefined || filme.duracao < 5) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DURAÇÃO]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.valor == undefined || isNaN(filme.valor) || filme.valor.length > 5) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[VALOR]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao.length > 3) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    } else {
        return false
    }

}


// função de inserir um novo filme
const inserirNovoFilme = async function (filme, ContentType) {
   
    try {
        // cria uma copia do JSON do arquivo de configuração da mensagens
        let customMenssagen = JSON.parse(JSON.stringify(mensagens))

        if (String(ContentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(filme)

            if (validar) {
                return validar
            } else {

                let result = await filmeDAO.insertFilme(filme)
                if (result) {//201
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.menssage = customMenssagen.SUCCESS_CREATED_ITEM.menssage
                } else {//500
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }
                return customMenssagen.DEFAULT_MESSAGE
            }
        } else {
        return customMenssagen.ERROR_CONTENT_TYPE
        }
    } catch (error) {
            
    }

}

const atualizarFilme = async function () {

}

const listarFilme = async function () {

}

const buscarFilme = async function () {

}

const excluirFilme = async function () {

}

module.exports = {
    inserirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme,

}