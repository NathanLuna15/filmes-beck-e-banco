#permite criar um dataBase
create database db_filmes_2026_b;

#mostra todos os dataBase exitente
show databases;

#permite escolher o database a ser utilizado
use db_filmes_2026_b;

#permite vizualizar todas as tabelas exitentes dentro do database
show tables;

create table tbl_filmes(
	id int not null auto_increment primary key,
    nome 				varchar(80) not null,
    sinopise 			text not null,
	capa 				varchar(255) not null,
    data_lancamento 	date not null,
    duracao				time not null,
    valor				decimaL(5,2) default 0,
    avaliacao			decimal(3,2) default 0
);

