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

    if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null ) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[SINOPSE]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.capa == undefined || filme.capa == '' || filme.capa == null || filme.capa > 255) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[CAPA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.data_lancamento == undefined || filme.data_lancamento == "" || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DATA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.duracao == undefined || filme.duracao == "" || filme.duracao == null ||  filme.duracao < 5) {
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
    
    //duvida??????????
    try {
        // cria uma copia do JSON do arquivo de configuração da mensagens
        let customMenssagen = JSON.parse(JSON.stringify(mensagens))
                                                //duvida??????????
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
                //duvida??????????
                } else {//500
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }
                //duvida??????????
                return customMenssagen.DEFAULT_MESSAGE
            }
        } else {
            return customMenssagen.ERROR_CONTENT_TYPEAA
        }   
    } catch (error) {
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarFilme = async function (filme, id, ContentType) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        
        if(String(ContentType).toUpperCase() == "APPLICATION/JSON"){
            
            //chama a função validarFilme e validar se o ID esta correto
            //se o ID existe no BD e se o filme existe
            let resultBuscarFilme = await buscarFilme(id)
            
            if(resultBuscarFilme.status){
                let validar = await validarDados(filme)
                console.log(validar);
                
                if(!validar){
                    
                    filme.id = Number(id)

                    // chama a função para atualizar o filme no BD
                    let result = await filmeDAO.updateFilmes(filme)
                    if(result){
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        console.log('1');
                        
                        return customMenssagen.DEFAULT_MESSAGE
                    }else{
                        console.log('2');
                        
                        return customMenssagen.ERRO_NOT_FONDI // 404
                    }
                }else{
                    console.log('3');
                    return validar // 500 model
                }

            }else{
                console.log('4');
                return resultBuscarFilme // 400(ID invalido) ou 400(não encontrado) ou 500 
            }

        }else{
            console.log('5');
            return customMenssagen.ERROR_CONTENT_TYPEAA
        }

    } catch (error) {
        console.log(error)
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

//duvida??????????
const listarFilme = async function () {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        let result = await filmeDAO.selectAllFilme()

        if (result) {
            if (result.length > 0) {
                customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_RESPOSE.status
                customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_RESPOSE.status_code
                customMenssagen.DEFAULT_MESSAGE.response.filme = result
                customMenssagen.DEFAULT_MESSAGE.response.count = result.length
                return customMenssagen.DEFAULT_MESSAGE
            } else {
                return customMenssagen.ERRO_NOT_FONDI
            }
        } else {
            return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
        }

    } catch (error) {
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarFilme = async function (id) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    try {               //duvida??????????
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeDAO.selectByIdFilme(id)
            if (result) {
                    //duvida??????????
                if (result.length > 0) {
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_RESPOSE.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_RESPOSE.status_code
                    customMenssagen.DEFAULT_MESSAGE.response.filme = result
                    return customMenssagen.DEFAULT_MESSAGE
                } else {
                    return customMenssagen.ERRO_NOT_FONDI
                }
            } else {
                return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
            }
        }    

    } catch (error) {
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
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