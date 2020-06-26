
create table Location (locId int auto_increment primary key, coords point);
create table User (userId int auto_increment primary key, name varchar (30), sex enum('M', 'F'), email varchar (30), birthdate date, user_locId int, foreign key (user_locId) references Location (locId));
create table Patient (patientId int auto_increment primary key, patient_userId int, foreign key (patient_userId) references User (userId));
create table Neuropsi (neuroId int auto_increment primary key, neuro_userId int, foreign key (neuro_userId) references User (userId));
create table File (fileId int auto_increment primary key, creationDate date, log varchar (500), file_patientId int unique, foreign key (file_patientId) references Patient (patientId));
create table Attribution (attribId int auto_increment primary key, attrib_fileId int, attrib_neuroId int, foreign key (attrib_fileId) references File (fileId), foreign key (attrib_neuroId) references Neuropsi (neuroId));
create table Route (routeId int auto_increment primary key, waypoints longtext, time float, distance float, route_locId int, foreign key (route_locId) references Location (locId));
create table Test (testId int auto_increment primary key, creationDate date, testTime int, testTitle varchar(100), test_routeId int, foreign key (test_routeId) references Route (routeId));
create table Exercise (exerId int auto_increment primary key, exerTime int, exer_testId int, foreign key (exer_testId) references Test (testId));
create table ExerType (exerTypeId int auto_increment primary key, typeName varchar(50));
create table ExerType_Attribution (typeAttribId int auto_increment primary key, attrib_exerId int, attrib_typeId int, foreign key (attrib_exerId) references Exercise (exerId), foreign key (attrib_typeId) references ExerType (exerTypeId));
create table Reschedule (reschedId int auto_increment primary key, resched_testId int, resched_newTestId int unique, foreign key (resched_testId) references Test (testId), foreign key (resched_newTestId) references Test (testId));
create table Evaluation (evalId int auto_increment primary key, assignedDate date, completedDate date, evalState enum('Scheduled', 'Completed', 'Filed', 'Rescheduled', 'Canceled') default 'Scheduled', eval_attribId int, eval_testId int, foreign key (eval_attribId) references Attribution (attribId), foreign key (eval_testId) references Test (testId));
create table Draw (drawId int auto_increment primary key, imgPath varchar(500), dropdownCheck boolean, imgWidth int, imgHeight int, imgPosX int, imgPosY int, imgTime int, draw_exerId int, foreign key (draw_exerId) references Exercise (exerId));
create table DrawResult (drawResultId int auto_increment primary key, rec longtext, comment varchar(500), drawResult_drawId int, foreign key (drawResult_drawId) references Draw (drawId));
create table Digits (digitsId int auto_increment primary key, numCards int, cardsInfo varchar(500), question varchar(100), correctAnswer varchar(100), digits_exerId int, foreign key (digits_exerId) references Exercise (exerId));
create table DigitsResult (digitsResultId int auto_increment primary key, answer varchar(100), correct boolean, digitsResult_digitsId int, foreign key (digitsResult_digitsId) references Digits (digitsId));
create table SavedTest (savedTestId int auto_increment primary key, savedTest_neuroId int, savedTest_testId int, foreign key (savedTest_neuroId) references Neuropsi (neuroId), foreign key (savedTest_testId) references Test (testId));
create table Template (tempId int auto_increment primary key, temp_testId int, foreign key (temp_testId) references Test (testId));

insert into Location (coords) values (point(-9.157689, 38.779941));
insert into Location (coords) values (point(-9.10697, 38.770611));
insert into Location (coords) values (point(-9.165965, 38.672674));
insert into Location (coords) values (point(-9.131448, 38.720356));

insert into User (name, sex, email, birthdate, user_locId) values ("Diego Santos Rocha", "M", "dsr@gmail.com", '1941-09-09', 1);
insert into User (name, sex, email, birthdate, user_locId) values ("Lucas Souza Gomes", "M", "lsg@gmail.com", '1988-12-24', 2);
insert into User (name, sex, email, birthdate) values ("Beatrice Pereira Cardoso", "F", "bpc@gmail.com", '1945-01-06');
insert into User (name, sex, email, birthdate) values ("Rafaela Ribeiro Oliveira", "F", "rro@gmail.com", '1956-01-15');
insert into User (name, sex, email, birthdate) values ("Artur Araujo Santos", "M", "aas@gmail.com", '1975-12-15');
insert into User (name, sex, email, birthdate) values ("Victor Dias Oliveira", "M", "vdo@gmail.com", '1966-06-25');
insert into User (name, sex, email, birthdate) values ("Isabela Cavalcanti Azevedo", "F", "ica@gmail.com", '1972-04-12');
insert into User (name, sex, email, birthdate) values ("Beatriz Pinto Ribeiro", "F", "bpr@gmail.com", '1968-09-18');
insert into User (name, sex, email, birthdate) values ("Alice Martins Goncalves", "F", "amg@gmail.com", '1951-11-22');
insert into User (name, sex, email, birthdate) values ("Gustavo Carvalho Santos", "M", "gcs@gmail.com", '1971-03-24');
insert into User (name, sex, email, birthdate) values ("Rebeca Pereira Pinto", "F", "rpp@gmail.com", '1954-11-24');
insert into User (name, sex, email, birthdate) values ("Miguel Pinto Cunha", "M", "mpc@gmail.com", '1949-08-01');
insert into User (name, sex, email, birthdate) values ("Gabriela Cunha Dias", "F", "gcd@gmail.com", '1948-02-26');
insert into User (name, sex, email, birthdate) values ("Victor Fernandes Melo", "M", "vfm@gmail.com", '1953-04-28');
insert into User (name, sex, email, birthdate) values ("Danilo Cunha Silva", "M", "dcs@gmail.com", '1949-09-19');
insert into User (name, sex, email, birthdate) values ("André Barbosa Gomes", "M", "abg@gmail.com", '1943-01-09');

insert into Patient (patient_userId) values (1);
insert into Patient (patient_userId) values (2);
insert into Patient (patient_userId) values (3);
insert into Patient (patient_userId) values (4);
insert into Patient (patient_userId) values (5);
insert into Patient (patient_userId) values (6);
insert into Patient (patient_userId) values (7);
insert into Patient (patient_userId) values (8);
insert into Patient (patient_userId) values (9);
insert into Patient (patient_userId) values (10);
insert into Patient (patient_userId) values (11);
insert into Patient (patient_userId) values (12);
insert into Patient (patient_userId) values (13);
insert into Patient (patient_userId) values (14);
insert into Patient (patient_userId) values (15);
insert into Patient (patient_userId) values (16);

insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 1);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 2);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 3);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 4);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 5);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 6);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 7);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 8);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 9);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 10);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 11);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 12);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 13);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 14);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 15);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 16);

insert into User (name, sex, email, birthdate, user_locId) values ("Luís Melo Rocha", "M", "lmr@gmail.com", '1967-12-25', 3);
insert into User (name, sex, email, birthdate, user_locId) values ("Clara Barbosa Almeida", "F", "cba@gmail.com", '1980-10-12', 4);
insert into User (name, sex, email, birthdate) values ("Martim Gomes Sousa", "M", "mgs@gmail.com", '1972-03-01');
insert into User (name, sex, email, birthdate) values ("Breno Cardoso Carvalho", "M", "bcc@gmail.com", '1970-04-10');
insert into User (name, sex, email, birthdate) values ("Bruna Ferreira Almeida", "F", "bfa@gmail.com", '1956-10-19');

insert into Neuropsi (neuro_userId) values (17);
insert into Neuropsi (neuro_userId) values (18);
insert into Neuropsi (neuro_userId) values (19);
insert into Neuropsi (neuro_userId) values (20);
insert into Neuropsi (neuro_userId) values (21);

insert into Attribution (attrib_fileId, attrib_neuroId) values (1, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (2, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (3, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (4, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (5, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (6, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (7, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (8, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (9, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (10, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (1, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (2, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (3, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (4, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (11, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (12, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (13, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (14, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (15, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (16, 3);
insert into Attribution (attrib_fileId, attrib_neuroId) values (7, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (8, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (9, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (10, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (11, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (12, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (13, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (14, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (15, 4);
insert into Attribution (attrib_fileId, attrib_neuroId) values (3, 5);
insert into Attribution (attrib_fileId, attrib_neuroId) values (5, 5);
insert into Attribution (attrib_fileId, attrib_neuroId) values (6, 5);
insert into Attribution (attrib_fileId, attrib_neuroId) values (8, 5);
insert into Attribution (attrib_fileId, attrib_neuroId) values (10, 5);
insert into Attribution (attrib_fileId, attrib_neuroId) values (12, 5);

insert into Route (route_locId) values (1);
insert into Route (route_locId) values (2);
insert into Route (route_locId) values (3);
insert into Route (route_locId) values (4);

insert into ExerType (typeName) values ("Draw");
insert into ExerType (typeName) values ("Digits");

insert into Test (creationDate, testTime, testTitle) values (CURRENT_DATE(), 30, "Teste 1");
insert into Test (creationDate, testTime, testTitle) values (CURRENT_DATE(), 40, "Teste 2");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Teste de memória");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Teste de percepção");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Teste geral");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Teste especial 1");
insert into Test (creationDate, testTime, testTitle) values (CURRENT_DATE(), 50, "Teste especial 2");
insert into Test (creationDate, testTime, testTitle) values (CURRENT_DATE(), 30, "Teste de memória 2");
insert into Test (creationDate, testTime, testTitle) values (CURRENT_DATE(), 30, "Teste de percepção 2");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Percepção visual");
insert into Test (creationDate, testTitle) values (CURRENT_DATE(), "Teste geral 2");

insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 1);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 2);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 3);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 4);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 5);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 6);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 7);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 8);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (1, 9);

insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 5);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 11);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 10);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 1);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 2);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 3);
insert into SavedTest (savedTest_neuroId, savedTest_testId) values (2, 4);

insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 1, 1);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 1, 2);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Scheduled', 1, 3);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Completed', 1, 4);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 1, 5);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Completed', 1, 6);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 1, 7);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Scheduled', 2, 5);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Completed', 3, 8);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Canceled', 3, 9);

insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 11, 5);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(),'Scheduled', 11, 11);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Filed', 11, 10);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Completed', 11, 1);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Scheduled', 11, 2);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Canceled', 12, 3);
insert into Evaluation (assignedDate, evalState, eval_attribId, eval_testId) values (CURRENT_DATE(), 'Scheduled', 12, 4);

insert into Exercise (exerTime, exer_testId) values (20, 1);
insert into Exercise (exerTime, exer_testId) values (10, 1);

insert into ExerType_Attribution (attrib_exerId, attrib_typeId) values (1, 1);
insert into ExerType_Attribution (attrib_exerId, attrib_typeId) values (2, 1);

insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 200, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 400, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 600, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 800, 2);






