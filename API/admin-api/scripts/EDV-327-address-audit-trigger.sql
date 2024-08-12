CREATE OR REPLACE TRIGGER address_audit 
AFTER UPDATE ON tblstudentpersonaldetails
FOR EACH ROW
WHEN (
   OLD.primary_phone     IS DISTINCT FROM NEW.primary_phone
   OR OLD.address        IS DISTINCT FROM NEW.address
   OR OLD.zipcode        IS DISTINCT FROM NEW.zipcode
   OR OLD.state          IS DISTINCT FROM NEW.state
   OR OLD.city           IS DISTINCT FROM NEW.city)
EXECUTE PROCEDURE address_audit(0);

CREATE OR REPLACE TRIGGER permanent_address_audit 
AFTER UPDATE ON tblstudentpersonaldetails
FOR EACH ROW
WHEN (
   OLD.permanent_address        IS DISTINCT FROM NEW.permanent_address
   OR OLD.permanent_zipcode        IS DISTINCT FROM NEW.permanent_zipcode
   OR OLD.permanent_state          IS DISTINCT FROM NEW.permanent_state
   OR OLD.permanent_city           IS DISTINCT FROM NEW.permanent_city)
EXECUTE PROCEDURE address_audit(1);

CREATE OR REPLACE FUNCTION address_audit() RETURNS trigger AS $$
DECLARE
    permanentAddressType int;
    inputAddressType int;
BEGIN
     permanentAddressType:= 1;
     inputAddressType := TG_ARGV[0];
    if (TG_OP = 'UPDATE') then
        if (inputAddressType = permanentAddressType) then
            insert into tbladdressaudit (loan_id,type,street_address,city,state,zipcode,phone) 
            values (NEW.loan_id,'Permanent',NEW.permanent_address,NEW.permanent_city,NEW.permanent_state,NEW.permanent_zipcode,NEW.primary_phone);
        else 
            insert into tbladdressaudit (loan_id,type,street_address,city,state,zipcode,phone) 
            values (NEW.loan_id,'Mailing',NEW.address,NEW.city,NEW.state,NEW.zipcode, NEW.primary_phone);
        end if;
        RETURN NEW;
    elsif (TG_OP = 'INSERT') then
        if (inputAddressType = permanentAddressType) then
            insert into tbladdressaudit (loan_id,type,street_address,city,state,zipcode,phone) 
            values (NEW.loan_id,'Permanent',NEW.permanent_address,NEW.permanent_city,NEW.permanent_state,NEW.permanent_zipcode,NEW.primary_phone);
        else 
            insert into tbladdressaudit (loan_id,type,street_address,city,state,zipcode,phone) 
            values (NEW.loan_id,'Mailing',NEW.address,NEW.city,NEW.state,NEW.zipcode, NEW.primary_phone);
        end if;
        RETURN NEW;
    else
        RAISE WARNING '[IF_MODIFIED_FUNC] - Other action occurred: %, at %',TG_OP,now();
        RETURN NULL;
    end if;
END;
$$
LANGUAGE plpgsql