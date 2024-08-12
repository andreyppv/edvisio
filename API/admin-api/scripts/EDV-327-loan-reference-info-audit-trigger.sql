CREATE OR REPLACE TRIGGER reference1_info_audit 
AFTER UPDATE ON tblreferenceinfo
FOR EACH ROW
WHEN (
   OLD.ref1_firstname || ' ' || OLD.ref1_lastname     IS DISTINCT FROM NEW.ref1_firstname || ' ' || NEW.ref1_lastname
   OR OLD.ref1_relationship   IS DISTINCT FROM NEW.ref1_relationship
   OR OLD.ref1_phone          IS DISTINCT FROM NEW.ref1_phone)
EXECUTE PROCEDURE reference_info_audit(1);

CREATE OR REPLACE TRIGGER reference2_info_audit 
AFTER UPDATE ON tblreferenceinfo
FOR EACH ROW
WHEN (
   OLD.ref2_firstname || ' ' ||  OLD.ref2_lastname     IS DISTINCT FROM NEW.ref2_firstname || ' ' || NEW.ref2_lastname
   OR OLD.ref2_relationship   IS DISTINCT FROM NEW.ref2_relationship
   OR OLD.ref2_phone          IS DISTINCT FROM NEW.ref2_phone)
EXECUTE PROCEDURE reference_info_audit(2);

CREATE OR REPLACE FUNCTION reference_info_audit() RETURNS trigger AS $$
DECLARE
    ref1 int;
    inputRef int;
BEGIN
     ref1:= 1;
     inputRef := TG_ARGV[0];
    if (TG_OP = 'UPDATE') then
        if (inputRef = ref1) then
            insert into tblreferenceinfoaudit (loan_id,name,relationship,phone) 
            values (NEW.loan_id,NEW.ref1_firstname || ' ' || NEW.ref1_lastname,NEW.ref1_relationship,NEW.ref1_phone);
        end if;
            insert into tblreferenceinfoaudit (loan_id,name,relationship,phone) 
            values (NEW.loan_id,NEW.ref2_firstname || ' ' || NEW.ref2_lastname,NEW.ref2_relationship,NEW.ref2_phone);
        RETURN NEW;
    elsif (TG_OP = 'INSERT') then
        if (inputRef = ref1) then
            insert into tblreferenceinfoaudit (loan_id,name,relationship,phone) 
            values (NEW.loan_id,NEW.ref1_firstname || ' ' || NEW.ref1_lastname,NEW.ref1_relationship,NEW.ref1_phone);
        end if;
            insert into tblreferenceinfoaudit (loan_id,name,relationship,phone) 
            values (NEW.loan_id,NEW.ref2_firstname || ' ' || NEW.ref2_lastname,NEW.ref2_relationship,NEW.ref2_phone);
        RETURN NEW;
    else
        RAISE WARNING '[IF_MODIFIED_FUNC] - Other action occurred: %, at %',TG_OP,now();
        RETURN NULL;
    end if;
END;
$$
LANGUAGE plpgsql