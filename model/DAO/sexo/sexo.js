//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)

const insertSexo = async function(sexo){
   
   try {
    
    let sql = `insert into tbl_sexo (
                    sexo,
                    sigla
                ) values (
                    '${sexo.sexo}',
                    '${sexo.sigla}'
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

const selectsexo = async function(){
    try {
        let sql = 'select * from tbl_sexo order by id desc;'
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

const update = async function (sexo){
    try {
        let sql = `update tbl_sexo set
                    sexo = '${sexo.sexo}',
                    sigla = '${sexo.sigla}'
                    where id = ${sexo.id};`

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

const selectByIdSexo = async function(id){
try {
    let sql = `select * from tbl_sexo where id = ${id};`

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

const deletSexo = async function(id){
    try {
        let sql = `delete from tbl_sexo where id=${id}`
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
    insertSexo,
    selectsexo,
    update,
    selectByIdSexo,
    deletSexo
}