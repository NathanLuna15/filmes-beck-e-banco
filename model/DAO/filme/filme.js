/*
*    Obijetivo: arquivo responsavel pelo CRUD de dados do filme no banco de dados 
*        MySQL
*    Data: 15/04/2026
*    autor: nathan
*    verção: 1.0
*/

// função para inserir um novo filme no banco de dados
const insertFilme = async function(filme){
    let sql = `
    insert into tbl_filmes (
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
    '${filme.avaliacao}'
);
    `
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