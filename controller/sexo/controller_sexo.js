const mensagens = require('../modulo/configMensassages.js')

const sexoDAO = require('../../model/DAO/sexo/sexo.js')


const validarDados = async function(sexo){
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(sexo.sexo == undefined || sexo.sexo == null || sexo.sexo == '' || sexo.sexo.length > 20 ){
        return custonMenssagen.ERROR_BAD_REQUEST.field = '[SEXO]  INVALIDO'
    }else if(sexo.sigla == undefined || sexo.sigla == null || sexo.sigla == '' || sexo.sigla.length > 2 ){
        return custonMenssagen.ERROR_BAD_REQUEST.field = '[SEXO]  INVALIDO'
    }else{
        return false
    }
}

const tratarDados = async function(sexo){
    sexo.sexo = sexo.sexo.replaceAll("'", "")
    sexo.sigla = sexo.sigla.replaceAll("'", "")
    return sexo
}

const inserirDados = async function(sexo, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        
       if (String(ContentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(sexo)

            if(validar){
                return true
            }else{
                let result = await sexoDAO.insertSexo(await tratarDados(sexo))
                
                if(result){
                    sexo.id = result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_CREATED_ITEM.message
                    customMenssagen.DEFAULT_MESSAGE.response = sexo
                    
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

const listarSexo = async function(){
        let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
        try {
            let result = await sexoDAO.selectsexo()
    
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

const buscarSexo = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        if(id == undefined || id == null || String(id).replaceAll(" ", '') == '' || isNaN(id)){
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] IVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        
        }else{
            let result = await sexoDAO.selectByIdSexo(id)
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

const atualizarDados = async function(sexo, id, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    try {
        if(String(ContentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscaID = await buscarSexo(id)


            if(resultBuscaID.status){
                let validar = await validarDados(genero)

                if(!validar){
                    sexo.id = Number(id)

                    let result = await sexoDAO.update(sexo)
                    if(result){
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = sexo

                        return customMenssagen.DEFAULT_MESSAGE
                    }else{
                        return customMenssagen.ERRO_NOT_FONDI
                    }
                }else{
                    return validar
                }  

            }else{
                console.log('3')
                return resultBuscaID
            }
  
        }else{
            console.log('4')
            return customMenssagen.ERROR_CONTENT_TYPE
        }


    } catch (error) {
        console.log(error)
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarSexo = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    try {
       let buscar = await buscarSexo(id)

        if(buscar.status){
            let result = await sexoDAO.deletGenero(id)

            if(result){
                
                customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_DELETE_ITEM.status
                customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_DELETE_ITEM.status_code
                customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_DELETE_ITEM.message

                return customMenssagen.DEFAULT_MESSAGE

            }else{
                console.log('2');
                return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            console.log('3');
            
            return buscar
        }

    } catch (error) {
        console.log(error);
        
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}




module.exports = {
    inserirDados,
    listarSexo,
    atualizarDados,
    deletarSexo,
    buscarSexo
}