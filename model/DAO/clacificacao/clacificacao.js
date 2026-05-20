//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)


const insertClassificacao = async function(classificacao){
   
   try {
    
    let sql = `insert into tbl_classificacao (
                    clacificacao
                ) values (
                    '${classificacao.clacificacao}'
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
 


module.exports = {
    insertClassificacao
 
}