import { Utils } from "@orbifold/utils";
import { Message } from "..";

export class NotebookCell {
	public typeName = "NotebookCell";
	// if the direction is output this contains the reference to the input cell
	public inputCellId: string|null = null;
	constructor(public notebook: any, public message: Message, public direction = "input", public index: string = "", public id: string = Utils.id()) {
	}
}
