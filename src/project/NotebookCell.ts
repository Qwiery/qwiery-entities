import { Utils } from "@orbifold/utils";
import { Message } from "..";

export class NotebookCell {
	public typeName = "NotebookCell";

	constructor(public notebook: any, public message: Message, public direction = "input", public index: string = "", public id: string = Utils.id()) {
	}
}
