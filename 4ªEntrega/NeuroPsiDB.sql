
create table Location (locId int auto_increment primary key, coords point);
create table User (userId int auto_increment primary key, name varchar (30), sex enum('M', 'F'), email varchar (30), birthdate date, user_locId int, foreign key (user_locId) references Location (locId));
create table Patient (patientId int auto_increment primary key, patient_userId int, foreign key (patient_userId) references User (userId));
create table Neuropsi (neuroId int auto_increment primary key, neuro_userId int, foreign key (neuro_userId) references User (userId));
create table File (fileId int auto_increment primary key, creationDate date, log varchar (500), file_patientId int unique, foreign key (file_patientId) references Patient (patientId));
create table Attribution (attribId int auto_increment primary key, attrib_fileId int, attrib_neuroId int, foreign key (attrib_fileId) references File (fileId), foreign key (attrib_neuroId) references Neuropsi (neuroId));
create table Route (routeId int auto_increment primary key, waypoints longtext, time float, distance float, route_locId int, foreign key (route_locId) references Location (locId));
create table Test (testId int auto_increment primary key, creationDate date, testTime int, test_routeId int, foreign key (test_routeId) references Route (routeId));
create table Exercise (exerId int auto_increment primary key, exerTime int, exer_testId int, foreign key (exer_testId) references Test (testId));
create table ExerType (exerTypeId int auto_increment primary key, typeName varchar(50));
create table ExerType_Attribution (typeAttribId int auto_increment primary key, attrib_exerId int, attrib_typeId int, foreign key (attrib_exerId) references Exercise (exerId), foreign key (attrib_typeId) references ExerType (exerTypeId));
create table Reschedule (reschedId int auto_increment primary key, resched_testId int, resched_newTestId int unique, foreign key (resched_testId) references Test (testId), foreign key (resched_newTestId) references Test (testId));
create table Evaluation (evalId int auto_increment primary key, assignedDate date, evalState enum('Scheduled', 'Completed', 'Filed', 'Rescheduled', 'Canceled') default 'Scheduled', eval_attribId int, eval_testId int, foreign key (eval_attribId) references Attribution (attribId), foreign key (eval_testId) references Test (testId));
create table Draw (drawId int auto_increment primary key, imgPath varchar(500), dropdownCheck boolean, imgWidth int, imgHeight int, imgPosX int, imgPosY int, imgTime int, draw_exerId int, foreign key (draw_exerId) references Exercise (exerId));
create table DrawResult (drawResultId int auto_increment primary key, rec longtext, completedDate date, comment varchar(500), drawResult_drawId int, foreign key (drawResult_drawId) references Draw (drawId));
create table Digits (digitsId int auto_increment primary key, numCards int, cardsInfo varchar(500), question varchar(100), correctAnswer varchar(100), digits_exerId int, foreign key (digits_exerId) references Exercise (exerId));
create table SavedTest (savedTestId int auto_increment primary key, savedTest_neuroId int, savedTest_testId int, foreign key (savedTest_neuroId) references Neuropsi (neuroId), foreign key (savedTest_testId) references Test (testId));
create table Template (tempId int auto_increment primary key, temp_testId int, foreign key (temp_testId) references Test (testId));

insert into Location (coords) values (point(-9.157689, 38.779941));
insert into User (name, sex, email, birthdate, user_locId) values ("Diego Santos Rocha", "M", "dsr@gmail.com", '1941-09-09', 1);
insert into Patient (patient_userId) values (1);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 1);

insert into Location (coords) values (point(-9.10697, 38.770611));
insert into User (name, sex, email, birthdate, user_locId) values ("Lucas Souza Gomes", "M", "lsg@gmail.com", '1988-12-24', 2);
insert into Patient (patient_userId) values (2);
insert into File (creationDate, file_patientId) values (CURRENT_DATE(), 2);

insert into Location (coords) values (point(-9.165965, 38.672674));
insert into User (name, sex, email, birthdate, user_locId) values ("Luís Melo Rocha", "M", "lmr@gmail.com", '1967-12-25', 3);
insert into Neuropsi (neuro_userId) values (3);

insert into Location (coords) values (point(-9.131448, 38.720356));
insert into User (name, sex, email, birthdate, user_locId) values ("Clara Barbosa Almeida", "F", "cba@gmail.com", '1980-10-12', 4);
insert into Neuropsi (neuro_userId) values (4);

insert into Attribution (attrib_fileId, attrib_neuroId) values (1, 1);
insert into Attribution (attrib_fileId, attrib_neuroId) values (2, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (1, 2);
insert into Attribution (attrib_fileId, attrib_neuroId) values (2, 1);

insert into Route (route_locId) values (1);
insert into Route (route_locId) values (2);
insert into Route (route_locId) values (3);
insert into Route (route_locId) values (4);

insert into ExerType (typeName) values ("Draw");
insert into ExerType (typeName) values ("Digits");

insert into Test (creationDate, testTime) values (CURRENT_DATE(), 30);

insert into Exercise (exerTime, exer_testId) values (20, 1);
insert into Exercise (exerTime, exer_testId) values (10, 1);

insert into ExerType_Attribution (attrib_exerId, attrib_typeId) values (1, 1);
insert into ExerType_Attribution (attrib_exerId, attrib_typeId) values (2, 1);

insert into Evaluation (assignedDate, eval_attribId, eval_testId) values (CURRENT_DATE(), 1, 1);

insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 200, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 400, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 600, 1);
insert into Draw (imgPath, imgWidth, draw_exerId) values ("test", 800, 2);






