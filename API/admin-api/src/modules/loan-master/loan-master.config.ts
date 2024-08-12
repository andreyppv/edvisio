import { TuitionProductIDs } from 'src/common/utilities/common_utils';
const loanMasterConfig = {
  ricTemplates: {
    path: '../../assets/template/ric/',
    stateConfigs: [
      {
        state: 'IL',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: false,
        salesAgreementForm: false,
        template: 'ric_illinois.html',
        pageRangeToMerge: null,
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;">The terms of this Agreement are contained on more than one page</li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px;">Illinois</span>
        </div>
          `,
      },
      {
        state: 'IL',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_illinois_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">IL</span>
        </div>
          `,
      },
      {
        state: 'AL',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_alabama.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">AL</span>
        </div>
          `,
      },
      {
        state: 'CA',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_california.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">CA</span>
        </div>
          `,
      },
      {
        state: 'DE',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_denver.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">DE</span>
        </div>
          `,
      },
      {
        state: 'HI',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_hawaii.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">HI</span>
        </div>
          `,
      },
      {
        state: 'MA',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_massachusetts_ed2go.html',
        pageRangeToMerge: [[1, 6]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">MA</span>
        </div>
          `,
      },
      {
        state: 'MI',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_minnesota_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">MI</span>
        </div>
          `,
      },
      {
        state: 'MO',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_missouri_ed2go.html',
        pageRangeToMerge: [[1, 6]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">MO</span>
        </div>
          `,
      },
      {
        state: 'NJ',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_newjersey_ed2go.html',
        pageRangeToMerge: [[1, 6]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">NJ</span>
        </div>
          `,
      },
      {
        state: 'NY',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_newyork_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">NY</span>
        </div>
          `,
      },
      {
        state: 'PA',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_pennsylvania_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">PA</span>
        </div>
          `,
      },
      {
        state: 'WA',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_washington_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">WA</span>
        </div>
          `,
      },
      {
        state: 'WI',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_wisconsin_ed2go.html',
        pageRangeToMerge: [[1, 5]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;"></li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">WI</span>
        </div>
          `,
      },
      {
        state: 'MULTISTATE',
        products: [TuitionProductIDs.TUITION_FLEX, TuitionProductIDs.TUITION_FLEXPLUS],
        ed2go: true,
        salesAgreementForm: true,
        template: 'ric_multistate_ed2go.html',
        pageRangeToMerge: [[1, 7]],
        footerTemplate: `
        <div style="font-family: Calibri; font-size: 10px; width: 100%;">
        <ul style = "position: relative;padding: 0;margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <li style="display: flex;margin: 1px;padding-top: 8px;font-weight:bold;">The terms of this Agreement are contained on more than one page.</li>
          <li style="display: flex;margin: 1px;padding: 5px; position: absolute; top: 0; right: 80px;"><span class="pageNumber""></li>
        </ul>
        <span style="float:right; padding: 5px; margin-right: 80px; margin-top: 5px;">Multistate</span>
        </div>
          `,
      },
    ]
  },
};

export default () => ({ ...loanMasterConfig });
