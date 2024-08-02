import {
	
		
 	
		
 							// For Nested APIs / Join tables			
	 	
		
 	 							// For Nested APIs / Join tables			
	 							// For Nested APIs / Join tables			
	 							// For Nested APIs / Join tables			
	 	 	
		
 	
	
 	
		
   SetPetServiceSingle, SetPetOwnerSingle, SetPetOwnerPetsJoin, SetPetCareCenterSingle, SetPetCareCenterImagesJoin, SetPetCareCenterServicesJoin, SetPetCareCenterPetsJoin, SetManagerSingle, SetDocumentSingleMedia, SetPetSingle
} from "./services";
import Helper from "shared/helper";

var fn = {};

const defaultError = "Something went wrong while processing request!";

		
     
fn.AddOrUpdatePetService = async (input, enums, excludesItems) => {
const numberItems_PetService = [  'ServiceId','Price','DurationInDays','DurationInHours' ];
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    if (x.type === 'dropdown') {
                        data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                    } else   if (numberItems_PetService.indexOf(x.key) > -1) {
                            if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetPetServiceSingle(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdatePetOwner = async (input, excludesItems) => {
const numberItems_PetOwner = [  'OwnerId' ];
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
 if (numberItems_PetOwner.indexOf(x.key) > -1) {
                            if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetPetOwnerSingle(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetOwnerPets = async (PetId, OwnerId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        global.Busy(true);

        if (input.Deleted) {
            data = { Id: PetId, Deleted: input.Deleted };
            rslt = await SetPetOwnerPetsJoin(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            data = { PetId: input.PetId, Deleted: input.Deleted };

            rslt = await SetPetSingle(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: PetId, PetId: id, OwnerId };
                rslt = await SetPetOwnerPetsJoin(data);
                if (!rslt.status) {
                    global.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    global.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            global.Busy(false);
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }
        global.Busy(false);

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdatePetCareCenter = async (input, excludesItems) => {
const numberItems_PetCareCenter = [  'PcId','Latitude','Longitude','Pincode' ];
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
 if (numberItems_PetCareCenter.indexOf(x.key) > -1) {
                            if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetPetCareCenterSingle(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterImages = async (DocId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        global.Busy(true);

        if (input.Deleted) {
            data = { Id: DocId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterImagesJoin(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, DocId: input.DocId });
            }

            data = { DocId: input.DocId, Deleted: input.Deleted };

            rslt = await SetDocumentSingle(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, DocId: input.DocId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetDocumentSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: DocId, DocId: id, PcId };
                rslt = await SetPetCareCenterImagesJoin(data);
                if (!rslt.status) {
                    global.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    global.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            global.Busy(false);
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }
        global.Busy(false);

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterServices = async (ServiceId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        global.Busy(true);

        if (input.Deleted) {
            data = { Id: ServiceId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterServicesJoin(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, ServiceId: input.ServiceId });
            }

            data = { ServiceId: input.ServiceId, Deleted: input.Deleted };

            rslt = await SetPetServiceSingle(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, ServiceId: input.ServiceId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetServiceSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: ServiceId, ServiceId: id, PcId };
                rslt = await SetPetCareCenterServicesJoin(data);
                if (!rslt.status) {
                    global.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    global.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            global.Busy(false);
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }
        global.Busy(false);

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterPets = async (PetId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        global.Busy(true);

        if (input.Deleted) {
            data = { Id: PetId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterPetsJoin(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            data = { PetId: input.PetId, Deleted: input.Deleted };

            rslt = await SetPetSingle(data);
            if (!rslt.status) {
                global.Busy(false);
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: PetId, PetId: id, PcId };
                rslt = await SetPetCareCenterPetsJoin(data);
                if (!rslt.status) {
                    global.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    global.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            global.Busy(false);
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }
        global.Busy(false);

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdateManager = async (input, excludesItems) => {
const numberItems_Manager = [  'MId','Pincode' ];
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
 if (numberItems_Manager.indexOf(x.key) > -1) {
                            if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetManagerSingle(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}
		

fn.AddOrUpdateDocument = async (input) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;
        const { 
        DocId,
        DocName,
        FileName,
        FileType,
        FileDescription
        , DocData
        } = input.value;
        global.Busy(true);
        let rslt = await SetDocumentSingleMedia(DocData, { 
        DocName,
        FileName,
        FileType,
        FileDescription
        , DocId: DocId });
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

		
     
fn.AddOrUpdatePet = async (input, excludesItems) => {
const numberItems_Pet = [  'PetId','Weight','Height' ];
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
 if (numberItems_Pet.indexOf(x.key) > -1) {
                            if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetPetSingle(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}




export default fn;