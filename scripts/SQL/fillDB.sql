INSERT INTO BackOfficeUser (email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number)VALUES('thibaut.berg@hotmail.com', '$2b$10$OoWWML05uIJCHV4FlE7z7eLq3MRatgeiSIpBDumGM./zlRrynkaIm', 'Thibaut', 'Berg', '2001-10-28', 'admin', 'Marche-en-Famenne', 'Rue des Champs', 6900, 53);
INSERT INTO BackOfficeUser (email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number)VALUES('nicolas.bernard@gmail.com', '$2b$10$dJIBLEEXU1n28Us5xtwCN.CJfMFA6AfpjvJTNE2wown7LRMdb4pvu', 'Nicolas', 'Bernard', '1995-01-01', 'admin', 'Spontin', 'Rue des Nicolas', 5581, 23);

INSERT INTO ReportType (label) VALUES ('Dépôt clandestin');
INSERT INTO ReportType (label) VALUES ('Lampadaire cassé');
INSERT INTO ReportType (label) VALUES ('Trottoire dégradé');

INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 2);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 1);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 2);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 3);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 3);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 3);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 1);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 1);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 1);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 2);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 3);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Namur', 'Place d''ange', 5000, 53, 1, 2);
INSERT INTO Report (description, state, city, street, zip_code, house_number, reporter, report_type) VALUES ('C''est un très beau report', 'en cours', 'Marche-en-Famenne', 'Rue des peupliers', 6900, 53, 1, 1);

INSERT INTO Event (date, duration, report, creator) VALUES ('2021-12-05', 1, 100, 1);
INSERT INTO Event (date, duration, report, creator) VALUES ('2021-12-05', 1, 100, 1);
INSERT INTO Event (date, duration, report, creator) VALUES ('2021-12-05', 1, 100, 1);
INSERT INTO Event (date, duration, report, creator) VALUES ('2021-12-05', 1, 100, 1);