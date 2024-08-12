const transunion = {
  url: 'https://netaccess-test.transunion.com/',
  productCode: '07000',
  version: '2.21',
  processingEnvironment: 'standardTest',
  prefixCode: '0622',
  industryCode: 'F',
  memberCode: '09351169',
  memberCodeHardPull: '09351169',
  password: 'J34F',
  certificate: {
    path:'src/modules/loan/underwriting/transunion/cert',
    crtPath: 'KUBERFI4.pem',
    keyPath: 'KUBERFI4Key.pem',
    password: 'secure123',
  },
  accountTypeCodes: {
    AF: 'Appliance/Furniture',
    AG: 'Collection Agency/Attorney',
    AL: 'Auto Lease',
    AU: 'Automobile',
    AX: 'Agricultural Loan',
    BC: 'Business Credit Card',
    BL: 'Revolving Business Lines',
    BU: 'Business',
    CB: 'Combined Credit Plan',
    CC: 'Credit Card',
    CE: 'Commercial Line of Credit',
    CH: 'Charge Account',
    CI: 'Commercial Installment Loan',
    CO: 'Consolidation',
    CP: 'Child Support',
    CR: 'Cond. Sales Contract; Refinance',
    CU: 'Telecommunications/Cellular',
    CV: 'Conventional Real Estate Mortgage',
    CY: 'Commercial Mortgage',
    DC: 'Debit Card',
    DR: 'Deposit Account with Overdraft Protection',
    DS: 'Debt Counseling Service',
    EM: 'Employment',
    FC: 'Debt Buyer',
    FD: 'Fraud Identify Check',
    FE: 'Attorney Fees',
    FI: 'FHA Home Improvement',
    FL: 'FMHA Real Estate Mortgage',
    FM: 'Family Support',
    FR: 'FHA Real Estate Mortgage',
    FT: 'Collection Credit Report Inquiry',
    FX: 'Flexible Spending Credit Card',
    GA: 'Government Employee Advance',
    GE: 'Government Fee for Services',
    GF: 'Government Fines',
    GG: 'Government Grant',
    GO: 'Government Overpayment',
    GS: 'Government Secured',
    GU: 'Govt. Unsecured Guar/Dir Ln',
    GV: 'Government',
    HE: 'Home Equity Loan HG Household Goods',
    HI: 'Home Improvement',
    IE: 'ID Report for Employment',
    IS: 'Installment Sales Contract',
    LC: 'Line of Credit',
    LE: 'Lease',
    LI: 'Lender-placed Insurance',
    LN: 'Construction Loan',
    LS: 'Credit Line Secured',
    MB: 'Manufactured Housing',
    MD: 'Medical Debt',
    MH: 'Medical/Health Care',
    NT: 'Note Loan',
    PS: 'Partly Secured',
    RA: 'Rental Agreement',
    RC: 'Returned Check',
    RD: 'Recreational Merchandise',
    RE: 'Real Estate',
    RL: 'Real Estate — Junior Liens',
    RM: 'Real Estate Mortgage',
    SA: 'Summary of Accounts — Same Status',
    SC: 'Secured Credit Card',
    SE: 'Secured',
    SF: 'Secondary Use of a Credit Report for Auto Financing',
    SH: 'Secured by Household Goods',
    SI: 'Secured Home Improvement',
    SM: 'Second Mortgage',
    SO: 'Secured by Household Goods & Collateral',
    SR: 'Secondary Use of a Credit Report',
    ST: 'Student Loan',
    SU: 'Spouse Support',
    SX: 'Secondary Use of a Credit Report for Other Financing',
    TS: 'Time Shared Loan',
    UC: 'Utility Company',
    UK: 'Unknown',
    US: 'Unsecured',
    VM: 'V.A. Real Estate Mortgage',
    WT: 'Individual Monitoring Report Inquiry',
  },
  bankruptcyTypes: [
    'CB',
    'TB',
    '1D',
    '1F',
    '1V',
    '1X',
    '2D',
    '2F',
    '2V',
    '2X',
    '3D',
    '3F',
    '3V',
    '3X',
    '7D',
    '7F',
    '7V',
    '7X',
  ],
  foreclosureTypes: [
    'DF', //Dismissed foreclosure
    'FC', //Foreclosure
    'SF', //Satisfied foreclosure
  ],
  taxlienType: [
    'FT', //Federal tax lien
    'SL', //State tax lien
    'TB', //Tax lien included in bankruptcy
    'TL', //Tax lien
    'TX', //Tax lien revived
    'PT', //Puerto Rico tax lien
    'PL', //Paid tax lien
    'PF', //Paid federal tax lien
  ],
  judgementType: [
    'CB', //Civil judgment in bankruptcy
    'CJ', //Civil judgment
    'CS', //Civil suit filed
  ], 
  garnishmentTypes: [
    'CP', //Child support
    'GN', //Garnishment
  ], 
  mopCodes: {
    PAYS_AS_AGREED: '01',
    DPD_30_59: '02',
    DPD_60_89: '03',
    DPD_90_119: '04',
    DPD_120PLUS: '05',
    DPD_150PLUS: '06',
    PAYING_OR_PAID_UNDER_WAGE_EARNER_PLAN_OR_SIMILAR_ARRANGEMENT: '07',
    REPOSSESSION: '08',
    VOLUNTARY_REPOSSESSION: '8A',
    PAYING_OR_PAID_ACCOUNT_WITH_MOP_08: '8P',
    CHARGED_OFF_TO_BAD_DEBT: '09',
    COLLECTION_ACCOUNT: '9B',
    PAYING_OR_PAID_ACCOUNT_WITH_MOP_09_OR_9B: '9P',
    UNRATED: 'UR',
  },
  dpd_60plus: ['3', 'K', 'G', 'L'],
};

// Manner of Payment (MOP) 01   02  03  04  05   07  08  8A  8P  09  9B  9P  UR
// Payment Pattern         1    2   3   4   5    |   Payment Pattern NA  |   X
// Enriched Pattern        1/E  2   3   4   5/H  X   K   J   K   L   G   G/L  X

if (process.env.NODE_ENV === 'production') {
  transunion.url = 'https://netaccess.transunion.com/';
  transunion.processingEnvironment = 'production';
  transunion.industryCode = 'M';
  transunion.prefixCode = '1201';
  transunion.memberCode = '06280762';
  transunion.memberCodeHardPull = '06280762';
  transunion.password = 'C1EK';
  transunion.certificate.crtPath = 'LASERAWA.pem';
  transunion.certificate.keyPath = 'LASERAWAkey.pem';
  transunion.certificate.password = 'Alchemy2021';
}
export default () => ({ ...transunion });
