import { Utils } from "@orbifold/utils";
import { Message, Notebook } from "..";
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

	public x: number = 0;
	public y: number = 0;
	public width: number = 1;
	public height: number = 1;

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
}
