/*
    obijetivo: arquivo responsavel pela validação, tratamento de dados e malipulação para realizar o CRUD de filmes
    data: 17/04/2026
    autor: nathan 
    versão: 1.0
*/

//inporte do arquivo de comfigurações de mensagens do projeto
const mensagens = require('../modulo/configMensassages.js')

const filmeDAO = require('../../model/DAO/filme/filme.js')
const controllerFilmeGenero = require('./controller_filme_genero.js')
const controllerFilmeAtor = require('./controller_ator_filme.js')
const controllerAtor = require('../ator/controller_ator.js')
const controllerclassificacao = require('../classificacao/controller_classificacao.js')

const validarDados = async function (filme) {
    // cria uma copia do JSON do arquivo de configuração da mensagens
    let custonMenssagen = JSON.parse(JSON.stringify(mensagens))

    if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[NOME]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[SINOPSE]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.capa == undefined || filme.capa == '' || filme.capa == null || filme.capa > 255) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[CAPA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.data_lancamento == undefined || filme.data_lancamento == "" || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DATA]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.duracao == undefined || filme.duracao == "" || filme.duracao == null || filme.duracao < 5) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[DURAÇÃO]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.valor == undefined || isNaN(filme.valor) || filme.valor.length > 5) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[VALOR]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST

    } else if (filme.avaliacao == undefined || isNaN(filme.avaliacao) || filme.avaliacao.length > 3) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO]  INVALIDO'
        return custonMenssagen.ERROR_BAD_REQUEST
    } else if (filme.id_classificacao == undefined || filme.id_classificacao == null || isNaN(filme.id_classificacao) || filme.id_classificacao <= 0) {
        custonMenssagen.ERROR_BAD_REQUEST.field = '[ID_CLASSIFICACAO] INVALIDO' // verificação da chave estrangeira 
        return custonMenssagen.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = async function (filme) {

    filme.nome = filme.nome.replaceAll("'", "")
    filme.sinopse = filme.sinopse.replaceAll("'", "")
    filme.capa = filme.capa.replaceAll("'", "")
    filme.data_lancamento = filme.data_lancamento.replaceAll("'", "")
    filme.duracao = filme.duracao.replaceAll("'", "")
    filme.valor = String(filme.valor).replaceAll("'", "")
    filme.avaliacao = String(filme.avaliacao).replaceAll("'", "")
    return filme
}


// função de inserir um novo filme
const inserirNovoFilme = async function (filme, ContentType) {
    // cria uma copia do JSON do arquivo de configuração da mensagens
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {

        if (String(ContentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(filme)

            if (validar) {
                return validar
            } else {

                let result = await filmeDAO.insertFilme(await tratarDados(filme))
                if (result) {//201
                    filme.id = result


                    //manipulação de dados para inserir os generos relacionados a o filme 
                    // percorre o Array de generos que chegara na requisição pelo objeto filme 
                    for (let itemFilme of filme.genero) {
                        let filmeGenero = {
                            "id_filme": filme.id,
                            "id_genero": itemFilme.id
                        }

                        let resultFilmeGenero = await controllerFilmeGenero.inserirNovoGeneroFilme(filmeGenero)


                        if (!resultFilmeGenero.status) {
                            return customMenssagen.SUCCESS_CREATED_ITEM_WARING // 201 mas erro de cadastro 
                        }

                    }

                    for (let itemAtor of filme.ator){
                        let filmeAtor = {
                            "id_filme": filme.id,
                            "id_ator": itemAtor.id
                        }

                        let resultFilmeAtor = await controllerFilmeAtor.inserirNovoAtorFilme(filmeAtor)

                        if(!resultFilmeAtor.status){
                            return customMenssagen.SUCCESS_CREATED_ITEM_WARING
                        }

                    }


                    customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_CREATED_ITEM.status
                    customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_CREATED_ITEM.status_code
                    customMenssagen.DEFAULT_MESSAGE.menssage = customMenssagen.SUCCESS_CREATED_ITEM.menssage
                    customMenssagen.DEFAULT_MESSAGE.response = filme
                } else {//500
                    console.log("1");
                    
                    return customMenssagen.ERROR_INTERNAL_SERVER_MODEL//500
                }

                return customMenssagen.DEFAULT_MESSAGE
            }
        } else {
            return customMenssagen.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error);

        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}


const atualizarFilme = async function (filme, id, ContentType) {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {

        if (String(ContentType).toUpperCase() == "APPLICATION/JSON") {
            filme.id = Number(id)
            //chama a função validarFilme e validar se o ID esta correto
            //se o ID existe no BD e se o filme existe
            let resultBuscarFilme = await buscarFilme(id)

            if (resultBuscarFilme.status) {
                let validar = await validarDados(filme)

                if (!validar) {
                    // chama a função para atualizar o filme no BD
                    let result = await filmeDAO.updateFilmes(filme)                    
                    
                    if (result) {
                        //excluir as relações entre o filme e os generos(tabelas de relação)
                        let resultDeletGenero = await controllerFilmeGenero.excluirGeneroIdFilme(filme.id)
                        if (resultDeletGenero.status) {
                            for (let itemFilme of filme.genero) {
                                let filmeGenero = {
                                    "id_filme": filme.id,
                                    "id_genero": itemFilme.id
                                }

                                let resultFilmegenero = await controllerFilmeGenero.inserirNovoGeneroFilme(filmeGenero)
                                console.log(resultFilmegenero);

                                if (!resultFilmegenero.status) {
                                    return customMenssagen.SUCCESS_CREATED_ITEM_WARING // 201 mas erro de cadastro 
                                }

                            }
                        }

                        let resultDeletAtor = await controllerFilmeAtor.excluirAtorIdFilme(filme.id)
                        if(resultDeletAtor.status){
                            for(let itemfilme of filme.ator){
                                let filmeAtor = {
                                    "id_filme": filme.id,
                                    "id_ator": itemfilme.id 
                                }
                                let resultFilmeAtor = await controllerFilmeAtor.inserirNovoAtorFilme(filmeAtor)
                                if (!resultFilmeAtor.status){
                                    return customMenssagen.SUCCESS_CREATED_ITEM_WARING
                                }
                            }                                                                                                                                                                                                                                                                                                                                                                     
                        }

                        customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_UPDATE_ITEM.status
                        customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_UPDATE_ITEM.status_code
                        customMenssagen.DEFAULT_MESSAGE.mensage = customMenssagen.SUCCESS_UPDATE_ITEM.mensage
                        customMenssagen.DEFAULT_MESSAGE.response = filme
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
                console.log('4 controller filme');
                return resultBuscarFilme // 400(ID invalido) ou 400(não encontrado) ou 500 
            }

        } else {
            return customMenssagen.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        console.log('1');

        return customMenssagen.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}


const listarFilme = async function () {
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        let result = await filmeDAO.selectAllFilme()

        if (result) {
            if (result.length > 0) {

                //manipulação dos dados da classificação
                //percorre o Array de filmes 
                for (let filme of result) {
                    // busca na controller da classificação o ID referente a FK da classificação
                    let resultClassificacao = await controllerclassificacao.buscarClassificacao(filme.id_classificacao)

                    // se encontrar o id
                    if (resultClassificacao.status) {
                        //adiciona um atributo na classificação no JSON do filme e colar o resultado com os dados da 
                        //classificação
                        filme.classificacao = resultClassificacao.response.classificacao
                        //apaga o id_classificação
                        delete filme.id_classificacao
                    }
                    // Manipulação de dados para retornar o filme...

                    //Genero
                    let resultGenero = await controllerFilmeGenero.buscarFilmeGeneroIdfilme(filme.id)

                    if (resultGenero.status) {
                        filme.genero = resultGenero.response.filme
                    }

                    // Ator
                    let resultAtor = await controllerFilmeAtor.buscarFilmeAtorIdfilme(filme.id)

                    if(resultAtor.status){
                        filme.ator = resultAtor.response.filme
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

const buscarFilme = async function (id) {

    console.log(id);
    
    let customMenssagen = JSON.parse(JSON.stringify(mensagens))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id)) {
            customMenssagen.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMenssagen.ERROR_BAD_REQUEST
        } else {
            let result = await filmeDAO.selectByIdFilme(id)
            if (result) {

                if (result.length > 0) {

                    for (let filme of result) {
                        // busca na controller da classificação o ID referente a FK da classificação
                        let resultClassificacao = await controllerclassificacao.buscarClassificacao(filme.id_classificacao)

                        // se encontrar o id
                        if (resultClassificacao.status) {
                            //adiciona um atributo na classificação no JSON do filme e colar o resultado com os dados da 
                            //classificação
                            filme.classificacao = resultClassificacao.response.classificacao
                            //apaga o id_classificação
                            delete filme.id_classificacao
                        }

                        let resultGenero = await controllerFilmeGenero.buscarFilmeGeneroIdfilme(filme.id)

                        if (resultGenero.status) {
                            filme.genero = resultGenero.response.filme
                        }

                        let resultAtor = await controllerFilmeAtor.buscarFilmeAtorIdfilme(filme.id)

                        if (resultAtor.status) {
                            filme.ator = resultAtor.response.filme
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

const excluirFilme = async function (id) {
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
    inserirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme,
    tratarDados
}

