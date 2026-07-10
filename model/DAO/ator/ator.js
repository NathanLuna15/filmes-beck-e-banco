//inporta da blibioteca para manipular dados do banco de dados do mysql
const knex = require('knex')

// import do arquivo de configuração  para acesso ao banco de dados
const knexDatabaseConfig = require('../../database/database_config/knexConfig.js')

// Criar a conecção do banco de dados do MySQL 
const knexConection = knex(knexDatabaseConfig.development)


const insertAtor = async function(ator){
    try {
            let sql = `insert into tbl_ator (
                    nome,
                    data_nacimento
                ) values (
                    '${ator.nome}',
                    '${ator.data_nacimento}'
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

const selectAtor = async function(){
    try {
        let sql = 'select * from tbl_ator order by id desc;'
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

const updateAtor = async function (ator){
    try {
        let sql = `update tbl_ator set
                    nome = '${ator.nome}',
                    data_nacimento = '${ator.data_nacimento}'
                    where id = ${ator.id};`

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

const selectByIdAtor = async function(id){
try {
    let sql = `select * from tbl_ator where id = ${id};`

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

const deletAtor = async function(id){
    try {
        let sql = `delete from tbl_ator where id=${id}`
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
    insertAtor,
    selectAtor,
    updateAtor,
    selectByIdAtor,
    deletAtor
}