const mensagens = require('../modulo/configMensassages.js')

const generoDAO = require('../../model/DAO/genero/genero.js')
const { json } = require('body-parser')

const validarDados = async function(genero){
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(genero.genero == undefined || genero.genero == null || genero.nome == '' || genero.genero.length == 40 ){
        return custonMenssagen.ERROR_BAD_REQUEST.field = '[GENERO]  INVALIDO'
    }else{
        return false
    }
}

const tratarDados = async function(genero){
    genero.genero = genero.genero.replaceAll("'", "")
    return genero
}

const inserirDados = async function(genero, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        
       if (String(ContentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(genero)

            if(validar){
                return true
            }else{
                let result = await generoDAO.insertGenero(await tratarDados(genero))
                
                if(result){
                    genero.id = result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_CREATED_ITEM.message
                    customMenssagen.DEFAULT_MESSAGE.response = genero
                    
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

const atualizarDados = async function(genero, id, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    try {
        if(String(ContentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscaID = await buscarGenero(await tratarDados(genero))
           
            if(resultBuscaID.status){
                let validar = await validarDados(genero)

                if(!validar){
                    genero.id = Number(id)

                    let result = await generoDAO.update(genero)
                    if(result){
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = genero

                        return customMenssagen.DEFAULT_MESSAGE
                    }else{
                        return customMenssagen.ERRO_NOT_FONDI
                    }
                }else{
                    return validar
                }  

            }else{

            }
  

        }


    } catch (error) {
        
    }
}

const buscarGenero = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        if(id == undefined || id == null || String(id).replaceAll(" ", '') == '' || isNaN(id)){
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] IVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        
        }else{
            let result = await generoDAO.selectByIdGenero(id)
            if(result){
                if(result.length > 0){
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_RESPOSE.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_RESPOSE.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_RESPOSE.mensagens
                    customMenssagen.DEFAULT_MESSAGE.response.genero = result

                    return customMenssagen.DEFAULT_MESSAGE
                }else{
                    return customMenssagen.ERRO_NOT_FONDI
                }
            }else{
                return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


module.exports = {
    inserirDados,
    buscarGenero,
    atualizarDados
}