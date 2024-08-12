INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-31 16:03:54.369927',
    'No Repossession in 7 Years',
    'getReposessionInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-31 17:31:18.740747',
    'No Defaulted Education loan',
    'getEducationDPD120',
    'gt',
    0,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-01 09:18:18.522962',
    'No Open delinquent accounts 30 days or more',
    'getDPD30PlusOpen',
    'gt',
    0,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 08:28:58.073108',
    'No Education loan that is currently sixty (60) days or more past due',
    'getEducationDPD60Plus',
    'gt',
    0,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 09:48:37.087033',
    'No Collections or charge-offs equal to or greater than $500.00 within the last two (2) years',
    'getOpenChargedOffInXyearsInXbalance',
    'gt',
    0,
    1,
    24,
    500,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-31 09:39:14.03497',
    'Foreclosures in 7 years',
    'getForclosuresInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 12:23:45.521894',
    'No Wage Garnishment in 7 years',
    'getWageGarnishmentInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 12:25:07.068424',
    'No unpaid tax liens in last 7 years',
    'getUnpaidTaxlienInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 12:27:52.301953',
    'No account thirty (30+) DPD within sixty (60) months',
    'getDPD30plusInXmonths',
    'gt',
    0,
    1,
    60,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-31 10:23:52.156066',
    'Minimum Individual lines of credit',
    'getIndividualLines',
    'lt',
    5,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-01 19:10:14.9361',
    'No more than 1 Account with 90+ days in the last 24 months',
    'getDPD90plusInXMonths',
    'gt',
    1,
    1,
    24,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 12:32:31.752062',
    'No account reported as ninety (90) days or more delinquent in the past 12 months',
    'getDPD90plusInXMonths',
    'gt',
    0,
    1,
    12,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-29 15:14:07.420444',
    'Years of Credit History',
    'getCreditHistoryTimeInMonths',
    'lt',
    18,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 09:57:07.87826',
    'Check Frozen Credit',
    'getFrozenCredit',
    'eq',
    1,
    1,
    NULL,
    NULL,
    NULL
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-08-30 17:49:08.870003',
    'Number Of Public Records In 7 Years',
    'getPublicRecordInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );

INSERT INTO
  public.tblrules (
    id,
    disabled,
    createdat,
    description,
    credit_report_fn,
    declinedif,
    value,
    underwriting_id,
    months_constraint,
    ammount_constraint,
    years_constraint
  )
VALUES
  (
    DEFAULT,
    false,
    '2022-09-02 12:12:04.22097',
    'No Bankrupctcy in Last 7 years',
    'getBankruptcyInXYears',
    'gt',
    0,
    1,
    NULL,
    NULL,
    7
  );