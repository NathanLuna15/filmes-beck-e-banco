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
    ator.nome = ator.nome.replaceAll("'", "")
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
                    console.log("1");
                    
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }
                console.log("2");
                return customMenssagen.DEFAULT_MESSAGE
            }
        }else{
            console.log("3");
            return customMenssagen.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error);
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarAtor = async function(){
        let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
        try {
            let result = await atorDAO.selectAtor()
    
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

const atualizarDados = async function(ator, id, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    try {
        if(String(ContentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscaID = await atorDAO.updateAtor(id)


            if(resultBuscaID.status){
                let validar = await validarDados(ator)

                if(!validar){
                    ator.id = Number(id)

                    let result = await atorDAO.updateAtor(ator)
                    if(result){
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = ator

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
            console.log('4 ator')
            return customMenssagen.ERROR_CONTENT_TYPE
        }


    } catch (error) {
        console.log(error)
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarAtor = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        if(id == undefined || id == null || String(id).replaceAll(" ", '') == '' || isNaN(id)){
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] IVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        
        }else{
            let result = await atorDAO.selectByIdAtor(id)
            if(result){
                if(result.length > 0){
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_RESPOSE.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_RESPOSE.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_RESPOSE.mensagens
                    customMenssagen.DEFAULT_MESSAGE.response.ator = result

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


const deletarAtor = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    try {
       let buscar = await buscarAtor(id)

        if(buscar.status){
            let result = await atorDAO.deletAtor(id)

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
    inserirAtor,
    listarAtor,
    atualizarDados,
    buscarAtor,
    deletarAtor
}