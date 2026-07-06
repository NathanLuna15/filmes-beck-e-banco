const mensagens = require('../modulo/configMensassages.js')

const atorDAO = require('../../model/DAO/ator/ator.js')
const { json } = require('body-parser')

const validarDados = async function(ator){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(ator.nome == undefined || ator.nome == null || ator.nome == "" || ator.nome.length == 101){
        return customMenssagen.ERROR_BAD_REQUEST.field = '[NOME ATOR] INVALIDO'
    }else if(ator.data_nacimento == undefined || ator.data_nacimento == null || ator.data_nacimento == ""){
        return customMenssagen.ERROR_BAD_REQUEST.field = '[DATA] INVALIDO'
    }
}    

const tratarDados = async function(ator){
    ator.nome = ator.data_nacimento.replaceAll("'", "")
    ator.data_nacimento = ator.data_nacimento.replaceAll("'", '')
    return ator
}

const inserirAtor = async function(ator, ContentType) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    try {
        
        if (String(ContentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(ator)

            if(validar){
                return validar
            }else{
                let result = await atorDAO.insertAtor(await tratarDados(ator))

                if(result){
                    ator.id =result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_CREATED_ITEM.message
                    customMenssagen.DEFAULT_MESSAGE.response = ator

                }else{
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }

                return customMenssagen.DEFAULT_MESSAGE
            }
        }else{
            return customMenssagen.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirAtor
}