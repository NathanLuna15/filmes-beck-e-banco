const mensagens = require('../modulo/configMensassages.js')

const classificacaoDAO = require('../../model/DAO/clacificacao/clacificacao.js')
const { json } = require('body-parser')

const validarDados = async function(classificacao){
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(classificacao.classificacao == undefined || classificacao.classificacao == null || classificacao.classificacao == '' || classificacao.classificacao.length > 6 ){
        return custonMenssagen.ERROR_BAD_REQUEST.field = '[CLASSIFICAÇÃO]  INVALIDA'
    }else{
        return false
    }
}

const tratarDados = async function(classificacao){
    classificacao.classificacao = classificacao.replaceAll("'", "")
    return classificacao
}

const inserirDados = async function(classificacao, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        
       if (String(ContentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(classificacao)

            if(validar){
                return true
            }else{
                let result = await generoDAO.insertGenero(await tratarDados(classificacao))
                
                if(result){
                    classificacao.id = result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_CREATED_ITEM.message
                    customMenssagen.DEFAULT_MESSAGE.response = classificacao
                    
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
    inserirDados
 
}