/*
*    Obijetivo: arquivo responsavel pelo CRUD de dados do filme no banco de dados 
*        MySQL
*    Data: 15/04/2026
*    autor: nathan
*    verção: 1.0
*/

//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)

// função para inserir um novo filme no banco de dados
const insertFilme = async function(filme){
   
    try {
        
    let sql = `insert into tbl_filmes (
        nome,
        sinopse,
        capa,
        data_lancamento,
        duracao,
        valor,
        avaliacao
    ) values (
        '${filme.nome}',
        '${filme.sinopse}',
        '${filme.capa}',
        '${filme.data_lancamento}',
        '${filme.duracao}',
        '${filme.valor}',
        if('${filme.avaliacao}' = '', null, '${filme.avaliacao}')
    );`
    
        let result = await knexConection.raw(sql)
    
        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
   
}

//função para atualizar um filme já existente no banco de dados
const updateFilmes = async function(filme){
    
}

// função para todos os dados do filame do banco de dados 
const selectAllFilme = async function(){

}

// função de retornar um filme filtrado pelo ID
const selectByIdFilme = async function(){

}

// função para excluir um filme filtrado pelo ID
const deletFilme = async function(){

}


module.exports = {
    insertFilme,
    updateFilmes,
    selectAllFilme,
    selectByIdFilme,
    deletFilme
}