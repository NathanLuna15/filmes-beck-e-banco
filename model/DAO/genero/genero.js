//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)

const insertGenero = async function(genero){
   
   try {
    
    let sql = `insert into tbl_genero (
                    genero
                ) values (
                    '${genero.genero}'
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

const selectGenero = async function(){
    try {
        let sql = 'select * from tbl_genero order by id desc;'
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

const update = async function (genero){
    try {
        let sql = `update tbl_genero set
                    genero = '${genero.genero}'
                    where id = ${genero.id};`

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


const selectByIdGenero = async function(id){
try {
    let sql = `select * from tbl_genero where id = ${id};`

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

const deletGenero = async function(id){
    try {
        let sql = `delete from tbl_filmes where id=${id}`
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
    insertGenero,
    update,
    selectByIdGenero,
    selectGenero,
    deletGenero
}