//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)


const insertClassificacao = async function(classificacao){
   
   try {
    
    let sql = `insert into tbl_classificacao (
                    classificacao
                ) values (
                    '${classificacao.classificacao}'
                );`
            
    let result = await knexConection.raw(sql)

    if(result){
        return result[0].insertId
    }else{
        return false
    }

   } catch (error) {
    console.log(error);
    
     return false
   }
}

const selectClassificacao = async function(){
    try {
        let sql = 'select * from tbl_classificacao order by id desc;'
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



const selectByIdClassificacao = async function(id){
try {
    let sql = `select * from tbl_classificacao where id = ${id};`

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


const updateClassificacao = async function (classificacao){
    try {
        let sql = `update tbl_classificacao set
                    classificacao = '${classificacao.classificacao}'
                    where id = ${classificacao.id};`

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

const deletCassificacao = async function(id){
    try {
        let sql = `delete from tbl_classificacao where id=${id}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        console.log('10');
        
        console.log(error)
        return false
    }
}






module.exports = {
    insertClassificacao,
    selectByIdClassificacao,
    selectClassificacao,
    updateClassificacao,
    deletCassificacao
}