import { Utils } from "@orbifold/utils";

export class Dataset {

	constructor(public name: string = "New Dataset", public description: string = "", public id: string = Utils.id()) {
		// if (this.constructor === Dataset) {
		// 	throw new Error("Dataset is an abstract class.");
		// }
	}

}