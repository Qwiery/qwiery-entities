import { Utils } from "@orbifold/utils";

export class Perspective {
	public typeName = "Perspective";

	constructor(public name: string = "New Perspective", public description: string = "", public id: string = Utils.id()) {
	}
}
