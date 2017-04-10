create database hms;
drop table hms;
CREATE TABLE hms
(
  geom geometry(Point,4326),
  gid serial NOT NULL,
  lat numeric,
  lng numeric,
  pat_name character varying(60),
  doc_name character varying(60),
  add_no character varying(30),
  vill_name character varying(50),
  vill_code character varying(10),
  tam_name character varying(30),
  amp_name character varying(30),  
  prov_name character varying(20),
  date_sick date,
  buff_point numeric,
  CONSTRAINT hms_pkey PRIMARY KEY (gid)
)