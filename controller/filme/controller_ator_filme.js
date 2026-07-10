//inporte do arquivo de comfigurações de mensagens do projeto
const mensagens = require('../modulo/configMensassages.js')

const filmeAtorDAO = require('../../model/DAO/ator_filame/ator_filme.js')

//controllers
const controller_ator = require('../ator/controller_ator.js')

const validarDados = async function (filmeAtor) {
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))
    
    if (filmeAtor.id_filme == undefined || filmeAtor.id_filme == '' || filmeAtor.id_filme == null || filmeAtor.id_filme.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[ID.FILME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    }else if (filmeAtor.id_ator == undefined || filmeAtor.id_ator == '' || filmeAtor.id_ator == null || filmeAtor.id_ator.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[ID.ATOR]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    }else
    {
        return false
    }
}

// função de inserir um novo filme
const inserirNovoAtorFilme = async function (filmeAtor) {
     // cria uma copia do JSON do arquivo de configuração da mensagens
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
            let validar = await validarDados(filmeAtor)

            if (validar) {
                return validar
            } else {
                
                let result = await filmeAtorDAO.insertFilmeAtor(filmeAtor)
                if (result) {//201
                    filmeAtor.id = result
                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.menssage = customMenssagen.SUCCESS_CREATED_ITEM.menssage
                    customMenssagen.DEFAULT_MESSAGE.response = filmeAtor
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

const atualizarFilmeAtor = async function (filmeAtor, id) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
            //chama a função validarFilme e validar se o ID esta correto
            //se o ID existe no BD e se o filme existe
            let resultBuscarAtorFilme = await buscarFilmeAtor(filmeAtor)

            if (resultBuscarAtorFilme.status) {
                let validar = await validarDados(filmeAtor)
                console.log(validar);

                if (!validar) {
                    filmeAtor.id = Number(id)
                    // chama a função para atualizar o filme no BD
                    let result = await filmeAtorDAO.update(filmeAtor)
                    if (result) {
                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = filmeAtor
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
                return resultBuscarAtorFilme // 400(ID invalido) ou 400(não encontrado) ou 500 
            }

    } catch (error) {
        console.log(error)
        // console.log('1');
        
        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}


const listarFilmeAtor = async function () {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        let result = await filmeAtorDAO.selectFilmeAtor()

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

const buscarFilmeAtor = async function (filmeAtor) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
     try {               
        if (filmeAtor.id == undefined || String(filmeAtor.id).replaceAll(' ', '') == '' || filmeAtor.id == null || isNaN(filmeAtor.id)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeAtorDAO.selectByIdFilmeAtor(filmeAtor.id)
            if (result) {

                if (result.length > 0) {

                    for(let filme of result){
                        // busca na controller da classificação o ID referente a FK da classificação
                        let resultClassificacao = await controller_ator.buscarFilmeAtor(filme.id_classificacao)
                        
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
            let result = await filmeAtorDAO.selectByIdFilmeGenero(filmeGenero)
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
    // console.log(idFilme);
    
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))
    
     try {               
        if (idFilme == undefined || String(idFilme).replaceAll(' ', '') == '' || idFilme == null || isNaN(idFilme)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeAtorDAO.selectGeneroByIdFilme(idFilme)
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

// função para excluir a relação de genero do filme
const excluirGeneroIdFilme = async function (idFilme) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {

            let result = await filmeAtorDAO.deletGenerosByIdFilme(idFilme)
            if (result) {
                customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_DELETE_ITEM.status
                customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_DELETE_ITEM.status_code
                customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_DELETE_ITEM.message

                return customMenssagen.DEFAULT_MESSAGE
            } else {
                        return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
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
    excluirFilmeGenero,
    buscarFilmeGeneroIdGenero,
    buscarFilmeGeneroIdfilme,
    excluirGeneroIdFilme
}