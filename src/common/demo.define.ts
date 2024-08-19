import moment from "moment";

//The report address to be embedded in the iframe
export const reportAddress = 'https://aws.datafor.com.cn:448/datafor/plugin/datafor/api/share/open?shareid=hrpHe8ZLIm9QLnZ2XIRofIpy';

//The parameters of the report
export const reportParams = [
  '__xdmTimeout=150',
];

/**
 * 
 * Parameter name must be consistent with the uniqueName of the level in the report analysis model
 * You can pick up the uniqueName of the level in the report analysis model by using the browser's developer tool 
 * 
 * For example, when the report loads, a api request name `/plugin/datafor/api/cube/discover/{XXX}/metadata` in the network tab of the developer tool will be sent.
 * You can find the uniqueName of the level in the response data of the request.
 * 
 */
export const PARAMETERNAME = {
  productFamily: '[product_class].[hierarchy_product_family1].[product_family]',
  date: '[time_by_day].[AGG_the_date].[the_date]' 
}

export type SelectedType = {
  name: string,
  code: string
}

export const allFamiliesAvaiable = ['Drink', 'Food', 'Non-Consumable'].map(o=>({name: o, code: o}));
/**
 * Initial filter criteria. 
 * 
 * This set of default values will determine the initial state of the panel.
 *
 * You can also send them to the report through the send method in the onPageInitEvent method of the XDMWorker instance, 
 * so that the report can filter the data when it loads for the first time.
 */
export type PanelSelectedProps = {
  family: SelectedType[], 
  date: {
    start: number, 
    end: number
  }
}
export const defaults:PanelSelectedProps = {
  //family: [{name: 'Non-Consumable', code: 'Non-Consumable'}], 
  family: [], 
  date: {
    start: moment('1997-3-5').valueOf(),  
    end: moment('1997-3-20').valueOf()
  }
}
