//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)

const insertFilmeGenero = async function(filmeGenero){
   
   try {
    
    let sql = `insert into tbl_filme_genero (
                    genero
                ) values (
                    '${filmeGenero.filmeGenero}'
                );`
            
    let result = await knexConection.raw(sql)

    if(result){
        return result[0].insertId
    }else{
        return false
    }

   } catch (error) {
     return false
   }
}

const selectFilmeGenero = async function(){
    try {
        let sql = 'select * from tbl_filme_genero order by id desc;'
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

const update = async function (filmeGenero){
    try {
        let sql = `update tbl_filme_genero set
                    genero = '${filmeGenero.filmeGenero}'
                    where id = ${filmeGenero.id};`

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


const selectByIdFilmeGenero = async function(id){
try {
    let sql = `select * from tbl_filme_genero where id = ${id};`

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

//funçãi para retornar os dados do genero filtrado pelo ID do filme  
const selectGeneroByIdFilme = async function(id){
    try {
        let sql = ` select tbl_genero.*
                    from tbl_filmes
                        inner join tbl_filmes_genero 
                            on tbl_filmes.id = tbl_filmes_genero.id_filmes 
                    where tbl_filmes_id = ${id};`
    
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



const selectFilmesByIdGenero = async function(idgenero){
    try {
        let sql = ` select tbl_filmes.*
                    from tbl_filmes
                        inner join tbl_filmes_genero 
                            on tbl_filmes.id = tbl_filmes_genero.id_filmes 
                    where tbl_filmes_id = ${idgenero};`
    
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



const deletFilmeGenero = async function(id){
    try {
        let sql = `delete from tbl_filmes_genero where id=${id}`
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


module.exports = {
    insertFilmeGenero,
    update,
    selectFilmeGenero,
    selectByIdFilmeGenero,
    deletFilmeGenero,
    selectGeneroByIdFilme,
    selectFilmesByIdGenero
}