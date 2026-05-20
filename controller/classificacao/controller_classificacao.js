const mensagens = require('../modulo/configMensassages.js')

const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')

const validarDados = async function(classificacao){
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if(classificacao.classificacao == undefined || classificacao.classificacao == null || classificacao.classificacao == '' || classificacao.classificacao.length == 6 ){
        return custonMenssagen.ERROR_BAD_REQUEST.field = '[CLASSIFICAÇÃO]  INVALIDA'
    }else{
        return false
    }
}

const tratarDados = async function(classificacao){
    classificacao.classificacao = classificacao.classificacao.replaceAll("'", "")
    return classificacao
}

const inserirNovaClassificacao = async function (classificacao, ContentType) {
    // cria uma copia do JSON do arquivo de configuração da mensagens
   let customMenssagen = JSON.parse(JSON.stringify(mensagens))

   try {

       if (String(ContentType).toUpperCase() == 'APPLICATION/JSON') {
           let validar = await validarDados(classificacao)

           if (validar) {
               return validar
           } else {
               
               let result = await classificacaoDAO.insertClassificacao(await tratarDados(classificacao))
               if (result) {//201

                   classificacao.id = result
                   customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                   customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                   customMenssagen.DEFAULT_MESSAGE.menssage = customMenssagen.SUCCESS_CREATED_ITEM.menssage
                   customMenssagen.DEFAULT_MESSAGE.response = classificacao
               
                } else {//500
                   return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
               }

               return customMenssagen.DEFAULT_MESSAGE
           }
       } else {
           return customMenssagen.ERROR_CONTENT_TYPE
       }
   } catch (error) {
       return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
       
   }

}

const listarClassificacao = async function(){
        let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
        try {
            let result = await classificacaoDAO.selectClassificacao()
    
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

const buscarClassificacao = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        if(id == undefined || id == null || String(id).replaceAll(" ", '') == '' || isNaN(id)){
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] IVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        
        }else{
            let result = await classificacaoDAO.selectByIdClassificacao(id)
            if(result){
                if(result.length > 0){
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_RESPOSE.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_RESPOSE.status_code
                    customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_RESPOSE.mensagens
                    customMenssagen.DEFAULT_MESSAGE.response.classificacao = result

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


const atualizarclassificacao = async function(classificacao, id, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    try {
        if(String(ContentType).toUpperCase() == "APPLICATION/JSON"){

            let resultBuscaID = await buscarClassificacao(id)

            console.log(resultBuscaID);
            
            if(resultBuscaID.status){
                let validar = await validarDados(classificacao)

                if(!validar){
                    classificacao.id = Number(id)

                    let result = await classificacaoDAO.updateClassificacao(classificacao)
                    if(result){
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = classificacao

                        return customMenssagen.DEFAULT_MESSAGE
                    }else{
                        return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }  

            }else{

                return resultBuscaID
            }
  
        }else{
            return customMenssagen.ERROR_CONTENT_TYPE
        }


    } catch (error) {
        console.log(error);
        
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarclassificacao = async function(id){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    try {
       let buscar = await buscarClassificacao(id)

        if(buscar.status){
            let result = await classificacaoDAO.buscarClassificacao(id)
            
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
    inserirNovaClassificacao,
    listarClassificacao,
    buscarClassificacao,
    atualizarclassificacao,
    deletarclassificacao
 
}