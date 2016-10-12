-- Up
CREATE TABLE config (id INTEGER, url TEXT, useCSRF TEXT);
INSERT INTO config (id) VALUES (1);

-- Down
DROP TABLE config;
