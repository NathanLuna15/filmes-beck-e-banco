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
    sinopse 			text not null,
	capa 				varchar(255) not null,
    data_lancamento 	date not null,
    duracao				time not null,
    valor				decimaL(5,2) default 0,
    avaliacao			decimal(3,2) default 0
);

desc tbl_filmes;

insert into tbl_filmes (
	nome,
    sinopse,
    capa,
    data_lancamento,
    duracao,
    valor,
    avaliacao
) values (
	'Círculo de Fogo',
    'Quando várias criaturas monstruosas, conhecidas como Kaiju, começam 
    a emergir do mar, tem início uma batalha entre estes seres e os humanos. 
    Para combatê-los, a humanidade desenvolve uma série de robôs gigantescos, 
    os Jaegers, cada um controlado por duas pessoas através de uma conexão
    neural. Entretanto, mesmo os Jaegers se mostram insuficientes para 
    derrotar os Kaiju. Diante deste cenário, a última esperança é um velho 
    robô, obsoleto, que passa a ser comandado por um antigo piloto (Charlie Hunnam) 
    e uma treinadora (Rinko Kikuchi).',
    'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/95/84/20505241.jpg',
    '2013-8-9',
    '02:10:00',
    '35.95',
    '4'
);

select * from tbl_filmes;









