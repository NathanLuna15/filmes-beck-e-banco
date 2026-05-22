//inporte do arquivo de comfigurações de mensagens do projeto
const mensagens = require('../modulo/configMensassages.js')

const filmeGeneroDAO = require('../../model/DAO/filme_genero/filme_genero.js')

//controllers
const controllerclassificacao = require('../classificacao/controller_classificacao.js')

const validarDados = async function (filmeGenero) {
    // cria uma copia do JSON do arquivo de configuração da mensagens
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    if (filmeGenero.id_filmes == undefined || filmeGenero.id_filmes == '' || filmeGenero.id_filmes == null || filmeGenero.id_filmes.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    }else if (filmeGenero.id_genero == undefined || filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    }else
    {
        return false
    }
}



// função de inserir um novo filme
const inserirNovoGeneroFilme = async function (filmeGenero) {
     // cria uma copia do JSON do arquivo de configuração da mensagens
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
            let validar = await validarDados(filmeGenero)

            if (validar) {
                return validar
            } else {
                
                let result = await filmeGeneroDAO.insertFilme(filmeGenero)
                if (result) {//201
                    filme.id = result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.menssage = customMenssagen.SUCCESS_CREATED_ITEM.menssage
                    customMenssagen.DEFAULT_MESSAGE.response = filme
                } else {//500
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }

                return customMenssagen.DEFAULT_MESSAGE
            }
        
    } catch (error) {
       console.log(error);
       
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }

}

const atualizarFilmeGenero = async function (filmeGenero, id) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
            //chama a função validarFilme e validar se o ID esta correto
            //se o ID existe no BD e se o filme existe
            let resultBuscarFilme = await buscarFilmeGenero(filmeGenero)

            if (resultBuscarFilme.status) {
                let validar = await validarDados(filmeGenero)
                console.log(validar);

                if (!validar) {
                    filmeGenero.id = Number(id)
                    // chama a função para atualizar o filme no BD
                    let result = await filmeGeneroDAO.updateFilmes(filmeGenero)
                    if (result) {
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = filmeGenero
                        console.log('1');

                        return customMenssagen.DEFAULT_MESSAGE
                    } else {
                        console.log('2');

                        return customMenssagen.ERROR_INTERNAL_SERVER_MODEL // 404
                    }
                } else {
                    console.log('3');
                    return validar // 500 model
                }

            } else {
                console.log('4');
                return resultBuscarFilme // 400(ID invalido) ou 400(não encontrado) ou 500 
            }

    } catch (error) {
        console.log(error)
        console.log('1');
        
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}


const listarFilmeGenero = async function () {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        let result = await filmeGeneroDAO.selectAllFilme()

        if (result) {
            if (result.length > 0) {

                //manipulação dos dados da classificação
                //percorre o Array de filmes 
                for(let filme of result){
                    // busca na controller da classificação o ID referente a FK da classificação
                    let resultClassificacao = await controllerclassificacao.buscarClassificacao(filme.id_classificacao)
                    
                    // se encontrar o id
                    if(resultClassificacao.status){
                        //adiciona um atributo na classificação no JSON do filme e colar o resultado com os dados da 
                        //classificação
                        filme.classificacao = resultClassificacao.response.classificacao
                        //apaga o id_classificação
                        delete filme.id_classificacao
                    }
                }

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

const buscarFilmeGenero = async function (filmeGenero) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
     try {               
        if (filmeGenero.id == undefined || String(filmeGenero.id).replaceAll(' ', '') == '' || filmeGenero.id == null || isNaN(filmeGenero.id)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeGeneroDAO.selectByIdFilme(filmeGenero.id)
            if (result) {

                if (result.length > 0) {

                    for(let filme of result){
                        // busca na controller da classificação o ID referente a FK da classificação
                        let resultClassificacao = await controllerclassificacao.buscarClassificacao(filme.id_classificacao)
                        
                        // se encontrar o id
                        if(resultClassificacao.status){
                            //adiciona um atributo na classificação no JSON do filme e colar o resultado com os dados da 
                            //classificação
                            filme.classificacao = resultClassificacao.response.classificacao
                            //apaga o id_classificação
                            delete filme.id_classificacao
                        }
                    }

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

const buscarFilmeGeneroIdGenero = async function (filmeGenero) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
     try {               
        if (filmeGenero == undefined || String(filmeGenero).replaceAll(' ', '') == '' || filmeGenero == null || isNaN(filmeGenero)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeGeneroDAO.selectByIdFilme(filmeGenero.id)
            if (result) {

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


const buscarFilmeGeneroIdfilme = async function (idFilme) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
     try {               
        if (idFilme.id == undefined || String(idFilme.id).replaceAll(' ', '') == '' || idFilme.id == null || isNaN(idFilme.id)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeGeneroDAO.selectByIdFilme(idFilme.id)
            if (result) {

                if (result.length > 0) {

                    for(let filme of result){
                        // busca na controller da classificação o ID referente a FK da classificação
                        let resultClassificacao = await controllerclassificacao.buscarClassificacao(filme.id_classificacao)
                        
                        // se encontrar o id
                        if(resultClassificacao.status){
                            //adiciona um atributo na classificação no JSON do filme e colar o resultado com os dados da 
                            //classificação
                            filme.classificacao = resultClassificacao.response.classificacao
                            //apaga o id_classificação
                            delete filme.id_classificacao
                        }
                    }

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


const excluirFilmeGenero = async function (id) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        //chama a função de buscar filme para validar se o filme existe
        let resultBuscarFilme = await buscarFilme(id)

        if (resultBuscarFilme.status) {
            let result = await filmeDAO.deletFilme(id)
            if (result) {
                customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_DELETE_ITEM.status
                customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_DELETE_ITEM.status_code
                customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_DELETE_ITEM.message

                return customMenssagen.DEFAULT_MESSAGE
            } else {
                        return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            return resultBuscarFilme
        }

    } catch (error) {
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
}


module.exports = {
    inserirNovoGeneroFilme,
    atualizarFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGenero,
    excluirFilmeGenero
}