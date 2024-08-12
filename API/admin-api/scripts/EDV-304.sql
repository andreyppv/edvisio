ALTER TABLE tbluser
ADD alternate_type_id integer;

ALTER TABLE tbluser
ADD alternate_id character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD phone_number character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD driver_license character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD driver_license_state_id character varying COLLATE pg_catalog."default";

--STUDENT PERSONAL INFO

ALTER TABLE tblstudentpersonaldetails
ADD alternate_type_id integer;

ALTER TABLE tblstudentpersonaldetails
ADD alternate_id character varying COLLATE pg_catalog."default";

ALTER TABLE tblstudentpersonaldetails
ADD driver_license character varying COLLATE pg_catalog."default";

ALTER TABLE tblstudentpersonaldetails
ADD driver_license_state_id character varying COLLATE pg_catalog."default";

--DECISION ENGING
ALTER TABLE tbluser
ADD address_1 character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD address_2 character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD city character varying COLLATE pg_catalog."default";

ALTER TABLE tbluser
ADD zipcode character varying COLLATE pg_catalog."default";