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

// função de inserir um novo filme
const inserirNovoFilme = async function(filme){

    // cria uma copia do JSON do arquivo de configuração da mensagens
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 80){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
    }else if(filme.sinopse == '' || filme.sinopse == null || filme.sinopse == undefined ){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[SINOPSE]  INVALIDO'
    }else if(filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa > 255){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[CAPA]  INVALIDO'
    }else if(filme.data == "" || filme.data == null || filme.data == undefined || filme.data != 10){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DATA]  INVALIDO'
    }else if(filme.duracao == "" ||  filme.duracao == null || filme.duracao == undefined || filme.duracao < 5){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DURAÇÃO]  INVALIDO'
    }else if(filme.valor == undefined || isNaN(filme.valor) || filme.valor > 5){
        custonMenssagen.ERROR_BAD_REQUEST.field = '[VALOR]  INVALIDO'
    }else if(filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao.length){

    }else{
        let result = await filmeDAO.insertFilme(filme)

        if(result){
            custonMenssagen.DEFAUT_MENSSAGENS.status =custonMenssagen.SUCESS_CREATED_ITEM.status
            custonMenssagen.DEFAUT_MENSSAGENS.status_code = custonMenssagen.SUCESS_CREATED_ITEM.status_code
            custonMenssagen.DEFAUT_MENSSAGENS.menssage = custonMenssagen.SUCESS_CREATED_ITEM.menssage
        }else{
            custonMenssagen.DEFAUT_MENSSAGENS.status = custonMenssagen.ERRO_INTERNAL_SERVER_MODEL.status
            custonMenssagen.DEFAUT_MENSSAGENS.status_code = custonMenssagen.ERRO_INTERNAL_SERVER_MODEL.status_code
            custonMenssagen.DEFAUT_MENSSAGENS.menssage = custonMenssagen.ERRO_INTERNAL_SERVER_MODEL.menssage
        }

        
    }
    return custonMenssagen.DEFAUT_MENSSAGENS
}

const atualizarFilme = async function(){

}

const listarFilme = async function(){
    
}

const buscarFilme = async function(){

}

const excluirFilme = async function(){

}

module.exports ={
    inserirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme
}