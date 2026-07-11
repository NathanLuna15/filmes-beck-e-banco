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

create table tbl_genero(
	id int not null auto_increment primary key,
    genero varchar(40) not null 
);

insert into tbl_genero (
	genero
) values(
	"ficção"
);

select * from tbl_genero;

create table tbl_clacificacao(
	id int not null auto_increment primary key,
    clacificacao varchar(6) not null
);
alter table tbl_clacificacao rename to tbl_classificacao;
ALTER TABLE tbl_classificacao CHANGE COLUMN clacificacao  classificacao VARCHAR(6);
ALTER TABLE tbl_classificacao CHANGE COLUMN classificacao  classificacao VARCHAR(40);

create table tbl_nacionalidade(
	id int not null auto_increment primary key,
    nacionalidade varchar(70) not null,
    sigla varchar(3) not null
);

create table tbl_foto(
	id int not null auto_increment primary key,
    url_foto varchar(250) not null
);

create table tbl_sexo(
	id int not null auto_increment primary key,
	sexo varchar(20) not null,
    sigla varchar(3) not null
);

create table tbl_ator(
	id int not null auto_increment primary key,
	nome varchar(100)  not null,
    data_nacimento date not null
    
);

CREATE TABLE tbl_filme_genero (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_filmes INT NOT NULL,
    id_genero INT NOT NULL,
    FOREIGN KEY (id_filmes) REFERENCES tbl_filmes(id),
    FOREIGN KEY (id_genero) REFERENCES tbl_genero(id)
);


create table tbl_filme_ator(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_filme int not null,
    id_ator int not null,
    
    constraint FK_FILMEATOR_FILME 
    FOREIGN KEY (id_filme) REFERENCES tbl_filmes(id),
    
	constraint FK_FILMEATOR_ATOR
    FOREIGN KEY (id_ator) REFERENCES tbl_ator(id)
);

DESCRIBE tbl_filmes;
ALTER TABLE tbl_filmes ADD COLUMN id_classificacao INT;

desc tbl_genero;

desc tables;
DESCRIBE tbl_classificacao;
show table status;
show databases;