import { Utils } from "@orbifold/utils";
import { Message, MessageFactory, Notebook } from "..";
import _ from "lodash";
import { DebugMessage } from "~/messages/DebugMessage";

/**
 * Represents a notebook cell/item with a single in and multiple out messages.
 */
export class NotebookCell {
	public typeName = "NotebookCell";
	public hasFocus: boolean = false;

	/**
	 * The execution id or counter of the notebook cell.
	 * This is null by default, and is set when the cell is executed.
	 */
	public executionId: string | null = null;
	public canResize: boolean = true;
	public canMove: boolean = true;
	public canEdit: boolean = true;
	public canDelete: boolean = true;
	public canExecute: boolean = true;
	public x: number = 0;
	public y: number = 0;
	public width: number = 1;
	public height: number = 1;
	public title: string = "";
	public mode: string = "edit";

	/**
	 * Gets the id of the notebook cell.
	 * This is always the id of the message.
	 * @returns The id of the notebook cell.
	 */
	public get id(): string {
		return this.inputMessage.id;
	}

	/**
	 * Gets the index of the notebook cell.
	 * @returns The index of the notebook cell, or -1 if the cell is not part of a notebook.
	 */
	public get index() {
		if (this.notebook) {
			return this.notebook.cells.indexOf(this);
		} else {
			return -1;
		}
	}

	public static empty(nb: Notebook | null = null): NotebookCell {
		return new NotebookCell(nb, new DebugMessage());
	}

	public get hasOutput(): boolean {
		return this.outputMessages.length > 0;
	}

	/**
	 * Represents a notebook cell.
	 * @param notebook - The notebook object this cell belongs to.
	 * @param inputMessage
	 * @param outputMessages
	 */
	constructor(
		public notebook: any,
		public inputMessage: Message,
		public outputMessages: Message[] = [],
	) {

		if (!inputMessage) {
			throw new Error("Cannot create a notebook cell without a message.");
		}
		if (!outputMessages) {
			throw new Error("The output messages cannot be null or undefined.");
		}
		if (!_.isArray(outputMessages)) {
			throw new Error("The output messages should be an array.");
		}
		if (outputMessages.length > 0) {
			if (outputMessages.some(m => !(m instanceof Message))) {
				throw new Error("The output messages should be output messages.");
			}
		}
	}

	public toJSON(excludeOutput: boolean = false): any {
		return {
			typeName: this.typeName,
			id: this.id,
			inputMessage: this.inputMessage.toJSON(),
			outputMessages: excludeOutput ? [] : this.outputMessages.map(m => m.toJSON()),
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			title: this.title,
			mode: this.mode,
			canResize: this.canResize,
			canMove: this.canMove,
			canEdit: this.canEdit,
			canDelete: this.canDelete,
			canExecute: this.canExecute,
		};
	}

	static fromJson(json: any, nb): NotebookCell {
		const cell = new NotebookCell(
			nb,
			MessageFactory.fromJson(json.inputMessage),
			json.outputMessages.map((m: any) => MessageFactory.fromJson(m)),
		);
		cell.x = json.x;
		cell.y = json.y;
		cell.width = json.width;
		cell.height = json.height;
		cell.title = json.title;
		cell.mode = json.mode;
		cell.canResize = json.canResize;
		cell.canMove = json.canMove;
		cell.canEdit = json.canEdit;
		cell.canDelete = json.canDelete;
		cell.canExecute = json.canExecute;
		return cell;
	}
}
