//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)

const insertFilmeAtor = async function(filmeAtor){
   
   try {
    
    let sql = `insert into tbl_filme_ator (
                    id_filmes,
                    id_ator
                ) values (
                    '${filmeAtor.id_filme}',
                    '${filmeAtor.id_ator}'
                );`
            
    let result = await knexConection.raw(sql)

    if(result){
        return result[0].insertId
    }else{
        return false
    }

   } catch (error) {
    console.log(error)
     return false
   }
}

const selectFilmeAtor = async function(){
    try {
        let sql = 'select * from tbl_filme_ator order by id desc;'
        let result = await knexConection.raw(sql)
        
        if(Array.isArray(result)){
            return result[0]  
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const update = async function (filmeAtor){
    try {
        let sql = `update tbl_filme_ator set
                    ator = '${filmeAtor.filmeAtor}'
                    where id = ${filmeAtor.id};`

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


const selectByIdFilmeAtor = async function(id){
try {
    let sql = `select * from tbl_filme_ator where id = ${id};`

    let result = await knexConection.raw(sql)
    if(Array.isArray(result)){
        return result[0]
    }else{
        return false
    }
    
} catch (error) {
    return false
}
}

const selectAtorByIdFilme = async function(idFimeAtor){
    try {
        let sql = `select tbl_ator.*
                    from tbl_filmes
                        inner join tbl_filme_ator
                            on tbl_filmes.id = tbl_filme_ator.id_filmes
                        inner join tbl_ator
                            on tbl_ator.id = tbl_filme_ator.id_ator
                    where tbl_filmes.id = ${idFimeAtor};`
    
        // console.log(sql);
        
        let result = await knexConection.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
        
    } catch (error) {

        return false
    }
    }



const selectFilmesByIdAtor = async function(idAtor){
    try {
        let sql = ` select tbl_filmes.*
                    from tbl_filmes
                        inner join tbl_filmes_ator 
                            on tbl_filmes.id = tbl_filmes_ator.id_filmes 
                    where tbl_filmes_id = ${idAtor};`
    
        let result = await knexConection.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
    }



const deletFilmeAtor = async function(id){
    try {
        let sql = `delete from tbl_filmes_ator where id=${id}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        console.log(error);
        
        return false
    }
}
const deletAtorsByIdFilme = async function(idFilme){
    try {
        let sql = `delete from tbl_filme_ator where id_filmes=${idFilme}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        // console.log(error);
        
        return false
    }
}


module.exports = {
    insertFilmeAtor,
    update,
    selectFilmeAtor,
    selectByIdFilmeAtor,
    selectAtorByIdFilme,
    selectFilmesByIdAtor,
    deletFilmeAtor,
    deletAtorsByIdFilme
}