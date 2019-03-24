create database museumdb;
use museumdb;

/*---------------Reigion---------------------*/
CREATE TABLE Region (
region    		CHAR(30) PRIMARY KEY,
average_precip_mm 	INT,
average_temp_c	INT
	);


INSERT INTO Region VALUES ('New York City, New York', '2500', '17');
INSERT INTO Region VALUES ('Iquitos City, Peru', '3000', '28');
INSERT INTO Region VALUES ('Nuuk, Greenland', '700', '-2');
INSERT INTO Region VALUES ('Cape Town, South Africa', '300', '30');
INSERT INTO Region VALUES ('Fraser River, British Columbia', '300', '10');

/*----------Habitat----------------------------*/
CREATE TABLE Habitat (
habitat_name   	CHAR(30),
region    		CHAR(30),
PRIMARY KEY (habitat_name, region),
FOREIGN KEY (region) REFERENCES Region(region)
);

INSERT INTO Habitat VALUES ('temperate forest', 'New York City, New York');
INSERT INTO Habitat VALUES ('tropical rainforest', 'Iquitos City, Peru');
INSERT INTO Habitat VALUES ('tundra', 'Nuuk, Greenland');
INSERT INTO Habitat VALUES ('desert', 'Cape Town, South Africa');
INSERT INTO Habitat VALUES ('freshwater', 'Fraser River, British Columbia');

/*-----------Collection--------------------*/
CREATE TABLE Collection (
collection_name   	CHAR(20) PRIMARY KEY,
curator    		CHAR(20)
);

INSERT INTO Collection VALUES ('Fish Collection', 'Ryan Smith');
INSERT INTO Collection VALUES ('Plant Collection', 'Jenny Lee');
INSERT INTO Collection VALUES ('Marine Collection', 'Thomas Reid');
INSERT INTO Collection VALUES ('Insect Collection', 'Ben Wong');
INSERT INTO Collection VALUES ('Soil Collection', 'Carmen Jones');

/*------------Institution-----------------------*/
CREATE TABLE Institution(
	institution_name CHAR(50) PRIMARY KEY,
	phone CHAR(50),
	address CHAR(200));

INSERT INTO Institution(institution_name, phone, address) VALUES ('UBC', '822-1234', '2329 West Mall, Vancouver, BC V6T 1Z4');
INSERT INTO Institution(institution_name, phone, address) VALUES ('UVIC', '987-5678', '3800 Finnerty Rd, Victoria, BC V8P 5C2');
INSERT INTO Institution(institution_name, phone, address) VALUES ('UofAlberta', '567-3456', '234 Blach Rd, Calgary, AB K7P 5G1');
INSERT INTO Institution(institution_name, phone, address) VALUES ('SFU', '456-1234', '8888 University Dr, Burnaby, BC V5A 1S6');
INSERT INTO Institution(institution_name, phone, address) VALUES ('WWF', '947-5218', '4800 Gah Rd, Victoria, BC V6P 2C9');

/*------------storage room temperature---------*/

CREATE TABLE Storage_Room_Temperature(
	storage_room CHAR(30) PRIMARY KEY,
	storage_temperature DECIMAL);
	
INSERT INTO Storage_Room_Temperature(storage_room, storage_temperature) VALUES ('Bella Coola', 2.3);
INSERT INTO Storage_Room_Temperature(storage_room, storage_temperature) VALUES ('Squamish', 8.7);
INSERT INTO Storage_Room_Temperature(storage_room, storage_temperature) VALUES ('Okanagan', 17.9);
INSERT INTO Storage_Room_Temperature(storage_room, storage_temperature) VALUES ('Tofino', 11.2);
INSERT INTO Storage_Room_Temperature(storage_room, storage_temperature) VALUES ('Nanaimo', 13.4);

/*----------------storage---------------*/
CREATE TABLE Storage(
	storage_room CHAR(30),
	storage_container_number INTEGER,
PRIMARY KEY (storage_room, storage_container_number),
FOREIGN KEY (storage_room) REFERENCES Storage_Room_Temperature(storage_room));

INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Bella Coola', 12);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Bella Coola', 13);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Squamish', 34);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Squamish', 10);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Okanagan', 56);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Okanagan', 20);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Tofino', 78);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Nanaimo', 91);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Tofino', 70);
INSERT INTO Storage(storage_room, storage_container_number) VALUES ('Nanaimo', 16);

/*-----------Specimen------------*/
CREATE TABLE Specimen(
specimen_ID CHAR(20) Primary Key,
Common_name CHAR(50),
Scientific_name CHAR(50),
Institution_name CHAR(50) NOT NULL,
Date_collected DATE,
Habitat_name CHAR(30) NOT NULL,
Collection_name CHAR(20) NOT NULL,
Storage_room CHAR(50) NOT NULL,
Storage_container_number INT NOT NULL,
FOREIGN KEY (Institution_name) REFERENCES Institution(Institution_name),
FOREIGN KEY (Habitat_name) REFERENCES Habitat(Habitat_name),
FOREIGN KEY (Collection_name) REFERENCES Collection(Collection_name),
FOREIGN KEY (Storage_room, Storage_container_number) REFERENCES Storage(Storage_room, Storage_container_number));

INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('P0001', 'Horned Liverwort', 'Hornwort', 'UBC', date('2018-12-03'),'temperate forest', 'Plant Collection', 'Bella Coola', 12);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('A0001','Spiny-headed worms','ancalagon minor','UBC', date('1980-05-22'),'temperate forest', 'Soil Collection', 'Squamish', 34);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('P0002', 'Gnetum', 'Gnetum', 'UVIC',date('2000-04-30'),'temperate forest', 'Plant Collection', 'Okanagan', 56);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('A0002','Oysters','Crassostrea Gigas','SFU', date('1991-11-17'),'tropical rainforest', 'Fish Collection', 'Tofino', 78);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('P0003', 'Charales','Lamprothamnium paplosum', 'SFU', date('1992-02-14'),'desert', 'Plant Collection', 'Nanaimo', 91);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('A0003', 'Brown sea hare', 'Mollusca', 'SFU', date('2019-01-04'), 'freshwater', 'Marine Collection', 'Tofino', 70);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('A0004', 'flastworm', 'platyhelminthes', 'SFU', date('2019-02-01'), 'freshwater', 'Marine Collection', 'Nanaimo', 16);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('A0005', 'mud dragon', 'kinorhyncha', 'UVIC', date('2018-12-01'), 'freshwater', 'Marine Collection', 'Squamish', 10);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('P0004', 'maidenhair tree', 'Ginkophyta', 'UBC', date('2018-12-01'), 'temperate forest', 'Plant Collection', 'Okanagan', 20);
INSERT INTO Specimen (specimen_ID, Common_name, scientific_name, institution_name, date_collected, habitat_name, collection_name, storage_room, storage_container_number) 
VALUES ('P0005', 'clubmosses', 'Lycopodiophyta', 'SFU', date('2018-09-29'), 'temperate forest', 'Plant Collection', 'Bella Coola', 13);

/*----------Plant Phylum-----------------*/
CREATE TABLE Plant_Phylum (
        	plant_phylum_scientific_name  CHAR(50) Primary Key,
        	reproduction  CHAR(50),
        	vascularization  CHAR(50));

INSERT INTO Plant_Phylum (plant_phylum_scientific_name, reproduction, vascularization) VALUES ('Antheocerotophyta', 'Spore', 'None');
INSERT INTO Plant_Phylum (plant_phylum_scientific_name, reproduction, vascularization) VALUES ('Charophyta', 'Spore', 'None');
INSERT INTO Plant_Phylum (plant_phylum_scientific_name, reproduction, vascularization) VALUES ('Gnetophyta', 'Seeds', 'None');
INSERT INTO Plant_Phylum (plant_phylum_scientific_name, reproduction, vascularization) VALUES ('Ginkophyta', 'Seeds', 'Present');
INSERT INTO Plant_Phylum (plant_phylum_scientific_name, reproduction, vascularization) VALUES ('Lycopodiophyta',  'Spore', 'Present' );

/*-------------Plant Specimen--------------*/
CREATE TABLE Plant_Specimen(
        	Specimen_ID  CHAR(20) Primary Key,
        	Leaves BIT,
        	Roots BIT,
        	Stems BIT,
        	Plant_phylum_scientific_name  CHAR(50) NOT NULL,
        	FOREIGN KEY (Specimen_ID) REFERENCES Specimen(specimen_ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
        	FOREIGN KEY (Plant_phylum_scientific_name) REFERENCES Plant_Phylum(plant_phylum_scientific_name)
ON UPDATE CASCADE);

/*-------------Animal Phylum------------------*/
CREATE TABLE Animal_Phylum (
        	animal_phylum_scientific_name  CHAR(50) Primary Key,
        	reproduction  CHAR(50),
        	body_description  CHAR(50),
            blood  CHAR(50));

INSERT INTO Animal_Phylum (animal_phylum_scientific_name, reproduction, body_description, blood ) VALUES ('Priapulida','fertilization','Wide body-cavity', 'hemocoel');
INSERT INTO Animal_Phylum (animal_phylum_scientific_name, reproduction, body_description, blood) VALUES ('Sipuncula', 'planktonic','unsegmented',  'None');
INSERT INTO Animal_Phylum (animal_phylum_scientific_name, reproduction, body_description, blood) VALUES ('Mollusca', 'Fertilization','bilaterial symmetry', 'Open circulatory');
INSERT INTO Animal_Phylum (animal_phylum_scientific_name, reproduction, body_description, blood) VALUES ('platyhelminthes','asexual','bivalves', 'Large vessels');
INSERT INTO Animal_Phylum (animal_phylum_scientific_name, reproduction, body_description, blood) VALUES ('kinorhyncha',  'larvae', 'limbless', 'None');

/*------------Animal Specimen------------*/
CREATE TABLE Animal_Specimen (
        	Specimen_ID CHAR(20) Primary Key,
        	invertebrate BIT,
        	type_of_eater  CHAR(20),
        	locomotion  CHAR(20),
        	animal_phylum_scientific_name CHAR(50) NOT NULL,
        	FOREIGN KEY (Specimen_ID) REFERENCES Specimen(specimen_ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
        	FOREIGN KEY (animal_phylum_scientific_name) REFERENCES Animal_Phylum(animal_phylum_scientific_name)
ON UPDATE CASCADE);

INSERT INTO Animal_Specimen (specimen_ID, invertebrate, type_of_eater, locomotion, animal_phylum_scientific_name) VALUES ('A0001', 0, 'Carnivores', 'walk','Priapulida');
INSERT INTO Animal_Specimen (specimen_ID, invertebrate, type_of_eater, locomotion, animal_phylum_scientific_name) VALUES ('A0002', 1, 'Carnivores', 'swim', 'Sipuncula');
INSERT INTO Animal_Specimen (specimen_ID, invertebrate, type_of_eater, locomotion, animal_phylum_scientific_name) VALUES ('A0003', 0, 'Herbivores', 'crawl', 'Mollusca');
INSERT INTO Animal_Specimen (specimen_ID, invertebrate, type_of_eater, locomotion, animal_phylum_scientific_name) VALUES ('A0004', 1, 'Omnivores', 'swim', 'platyhelminthes');
INSERT INTO Animal_Specimen (specimen_ID, invertebrate, type_of_eater, locomotion, animal_phylum_scientific_name) VALUES ('A0005', 1, 'Omnivores', 'walk', 'kinorhyncha');

/*----------Institution has collectors-------------*/
CREATE TABLE Institution_Has_Collectors(
institution_name CHAR(50),
collector_name CHAR(50),
years_of_experience INTEGER,
PRIMARY KEY (institution_name, collector_name),
FOREIGN KEY (institution_name) REFERENCES Institution(institution_name)
ON DELETE CASCADE);

INSERT INTO Institution_Has_Collectors(institution_name, collector_name, years_of_experience) VALUES ('UBC', 'Joe Bobs', 9);
INSERT INTO Institution_Has_Collectors(institution_name, collector_name, years_of_experience) VALUES ('UVIC', 'Hank Finnegan', 3);
INSERT INTO Institution_Has_Collectors(institution_name, collector_name, years_of_experience) VALUES ('UofAlberta', 'Mary Ali', 23);
INSERT INTO Institution_Has_Collectors(institution_name, collector_name, years_of_experience) VALUES ('SFU', 'Grace Cheng', 8);
INSERT INTO Institution_Has_Collectors(institution_name, collector_name, years_of_experience) VALUES ('WWF', 'Kelly Fontana', 48);
