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

const tratarDados = function(genero){
    genero.genero = genero.genero.replaceAll("'", "")
}

const inserirDados = async function(genero, ContentType){
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        
       if (String(ContentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(genero)

            if(validar){
                return true
            }else{
                let result = await generoDAO.insertFilme(await tratarDados(genero))
                genero.id = result
                
            }

        }

    } catch (error) {
        
    }
}
