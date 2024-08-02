
import PetCareCenterJsonConfig from "config/petcarecenter_product_onetomany_oneToMany_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";

const MapItems = [



    { navpropname: "", uicomponent: "petcarecenter", expand: "Logo,Services", exclude: ['Logo'], func: Support.AddOrUpdatePetCareCenter }
,    { navpropname: "Services", uicomponent: "petserviceservices", expand: "Services", exclude: [], parent: "petcarecenter", child: true },
,    { navpropname: "Supervisor", uicomponent: "managersupervisor", expand: "Supervisor", exclude: [], func: Support.AddOrUpdateManager }
];

const FetchPetCareCenterInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(PetCareCenterJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of PetCareCenterJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });
        return resolve(item);
    });
}

const FetchPetCareCenterDetails = async (petcarecenterId, enums) => {

    return new Promise(async (resolve) => {
        let item = {}, rslt, backItem = {}, tmp;
        
        let petcarecenterServices = [];
        const keyItems = Object.keys(PetCareCenterJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of PetCareCenterJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (petcarecenterId) {
            global.Busy(true);

                    let rslt = await Api.GetPetCareCenterServicesJoin(petcarecenterId);
            if (rslt.status) petcarecenterServices = rslt.values;
            

            // Get PetCareCenter Details
            let $expand = [];
            let $expandItems = MapItems.filter(z => z.expand).map(x => x.expand);
            $expandItems.forEach(x => {
                if (x.indexOf(",") > -1) {
                    $expand.push(...x.split(","));
                } else {
                    $expand.push(x);
                }
            })

            $expand = Helper.RemoveDuplicatesFromArray($expand);

            rslt = await Api.GetPetCareCenterSingle(petcarecenterId, `$expand=${$expand}`);

            if (rslt.status) {

                const petcarecenter = rslt.values;

                for (let i = 0; i < MapItems.length; i++) {

                    const source = MapItems[i].navpropname;
                    const target = MapItems[i].uicomponent;
                    const parent = MapItems[i].parent;
                    const child = MapItems[i].child;

                    const sourceObj = Helper.IsNullValue(source) ? petcarecenter : petcarecenter[source];
                    if (parent && child) {
                        let _tmpItems = [];
                        let _fItem = item[target];//.filter(z => z.type !== 'keyid');
                        sourceObj.forEach(x => {
                            let _tmpItem = {};
                            _tmpItem['id'] = Helper.GetGUID();
                            _fItem.forEach(m => {
                                if (m.type === 'keyid' && !Helper.IsNullValue(x[m.key])) {
                                    _tmpItem['id'] = x[m.key];
                                }
                                _tmpItem[m.key] = x[m.key]
                            })
                            _tmpItems.push(_tmpItem);
                        });

                        item[target].find((x) => x.type === "keyid").values = _tmpItems;
                    } else {
                        for (let prop in sourceObj) {
                            const tItem = item[target].find((x) => x.key === prop);
                            if (tItem && !Helper.IsNullValue(sourceObj[prop])) {

                                let _nValue = null;
                                if (tItem.type === 'dropdown') {
                                    const { Values } = enums.find((z) => z.Name === tItem.source);
                                    const _value = Values.find((m) => m[tItem.contentId] === sourceObj[prop] || m[tItem.valueId] === sourceObj[prop]) || {};
                                    _nValue = _value[tItem.valueId];

                                    if (!Helper.IsNullValue(_nValue) && item[tItem.mapitem]) {
                                        item[tItem.mapitem].forEach(x => x.editable = false);
                                    }

                                } else if (tItem.type === 'date') {
                                    let tmpDate = sourceObj[prop].split('T');
                                    _nValue = tmpDate[0];
                                } else {
                                    _nValue = sourceObj[prop];
                                }

                                item[target].find((x) => x.key === prop).value = _nValue;

                            }
                        }
                    }

                }

                // Get PetCareCenter Logo
                if (petcarecenter.Logo) {
                    tmp = {};
                    ['DocData', 
                        'DocId', 
                        'DocName', 
                        'FileName', 
                        'FileType', 
                        'FileDescription'
                    ].forEach((x) => {
                        tmp[x] = petcarecenter.Logo[x]
                    });

                    if (tmp.DocId > 0) {
                        rslt = await Api.GetDocumentSingleMedia(tmp.DocId, true);
                        if (rslt.status) tmp['DocData'] = rslt.values;
                    }
                    if (item['petcarecenter'].find((x) => x.key === "Logo")) item['petcarecenter'].find((x) => x.key === "Logo").value = tmp;
                }
            }

            let bItem = {};
            keyItems.forEach(elm => {
                let bItems = [];
                for (let prop of item[elm]) {
                    bItems.push({ key: prop.key, value: prop.value });
                }
                bItem[elm] = bItems;
            });

            backItem = Helper.CloneObject(bItem);

            global.Busy(false);
        }

                return resolve({ row: item, backRow: backItem, mapitems: petcarecenterServices });
    });
}

const FetchDropdownItems = async (items) => {
    return new Promise(async (resolve) => {

        global.Busy(true);

        // Default get all enums list items
        let res = await GetMetaDataInfo();

        const enums = res.filter((x) => x.Type === 'Enum') || [];
        const otherItems = items.filter(x => enums.findIndex(z => z.Name === x) === -1);

        // Extract the required entities as enums
        for (let i = 0; i < otherItems.length; i++) {
            const item = otherItems[i];
            await Api.GetEntityInfo(item + 's').then(rslt => {
                if (rslt.status) {
                    enums.push({ Name: item, Type: 'Entity', Values: rslt.values });
                }
            });
        }

        global.Busy(false);
        return resolve(enums);
    });
};

const Extract = async (petcarecenterId) => {

    return new Promise(async (resolve) => {

        let rtnObj = { row: {}, options: [], backRow: {} };

        await FetchPetCareCenterInfo().then(async (item) => {

            rtnObj.row = Helper.CloneObject(item);

            let oKeys = Object.keys(item);

            rtnObj.collections = [];
            Object.values(oKeys).forEach(elm => {
                const { parent, child, property } = item[elm].find(x => x.type === 'keyid');
                if (!Helper.IsNullValue(parent)) {
                    rtnObj.collections.push({ name: elm, parent, child, property });
                }
            });

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(petcarecenterId)) {
                    await FetchPetCareCenterDetails(petcarecenterId, enums).then(({ row, backRow, mapitems }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.mapitems = Helper.CloneObject(mapitems);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract, MapItems };

