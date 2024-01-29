import { Utils } from "@orbifold/utils";
import { NotebookCell } from "./NotebookCell";
import { CodeMessage, Message, TextMessage } from "..";
import _ from "lodash";

/**
 * The cells are organized in the correct order.
 */
export class Notebook {
	/**
	 * For (de)serialization.
	 */
	public typeName = "Notebook";

	private _cells: NotebookCell[] = [];

	public get cells(): NotebookCell[] {
		return this._cells;
	}

	constructor(
		public name: string = "New Notebook",
		public description: string = "",
		public id: string = Utils.id(),
	) {
	}

	/**
	 * A linear notebook is one where the cells are organized in the correct order.
	 * If false it means the cells should be rendered through a dashboard-like floating layout.
	 * @type {boolean}
	 */
	public linear: boolean = true;

	/**
	 * Adds an output message to the notebook.
	 *
	 * @param message - The message to be added as an output.
	 * @param inputCellId - The ID of the input cell associated with the output message.
	 * @returns The added output cell.
	 */
	public addOutput(message: Message, cellId: string) {
		const cell = this.getCellById(cellId);
		if (!cell) {
			throw new Error(`Cannot find cell with id ${cellId}.`);
		}
		message.isOutput = true;
		cell.outputMessages.push(message);
		return cell;
	}

	public setOutput(m: Message | Message[], cellId: string) {
		const cell = this.getCellById(cellId);
		if (!cell) {
			throw new Error(`Cannot find cell with id ${cellId}.`);
		}
		let msgs: Message[];
		if (!_.isArray(m)) {
			msgs = [<Message>m];
		} else {
			msgs = m as Message[];
		}
		msgs.forEach(m => m.isOutput = true);
		cell.outputMessages = msgs;
		return cell;
	}

	public addMessage(message: Message, referenceCellId: string | null = null,
					  beforeOrAfter: string = "after") {
		message.isOutput = false;
		return this.addCell(new NotebookCell(this, message), referenceCellId, beforeOrAfter);
	}

	public addInputOutput(input: Message, output: Message, referenceCellId: string | null = null,
						  beforeOrAfter: string = "after") {
		input.isOutput = false;
		output.isOutput = true;
		const cell = new NotebookCell(this, input, [output]);
		return this.addCell(cell, referenceCellId, beforeOrAfter);
	}

	/**
	 * Adds a new input cell.
	 * @param cell {NotebookCell} The cell to add. If none given a CodeMessage is created.
	 * @param referenceCellId {string} The id of the cell before or after which the new cell should be added.
	 * @param beforeOrAfter {string} Either "before" or "after". Default is "after".
	 */
	public addCell(
		cell: NotebookCell | null = null,
		referenceCellId: string | null = null,
		beforeOrAfter: string = "after",
	) {

		if (!cell) {
			cell = new NotebookCell(this, TextMessage.fromString(""));
		}

		if (Utils.isEmpty(referenceCellId)) {
			this.cells.push(cell);
		} else {
			// the id with the direction forms in a way a primary key
			const inputIndex = this.cells.findIndex(
				(c) => c.id === referenceCellId,
			);


			if (inputIndex === -1) {
				throw new Error(
					`Cannot find reference cell with id ${referenceCellId}.`,
				);
			}
			// after the output if available, but before always means before the input
			if (beforeOrAfter === "after") {
				this.cells.splice(
					inputIndex + 1,
					0,
					cell,
				);
			} else {
				this.cells.splice(inputIndex, 0, cell);
			}
		}
		return cell;
	}

	/**
	 * Returns an array of id' of the cells in the notebook.
	 * Note that the order is the same as the order of the cells.
	 * @returns {string[]} An array of cell IDs.
	 */
	public get idSequence() {
		return this.cells.map((c) => c.id);
	}

	/**
	 * Retrieves a cell from the notebook by its ID.
	 * @param id - The ID of the cell to retrieve.
	 * @returns The cell with the specified ID, or null if not found.
	 */
	public getCellById(id: string) {
		return this.cells.find((c) => c.id === id) || null;
	}


	public getInputMessages() {
		return this.cells.map((c) => c.inputMessage);
	}

	/**
	 * Checks if a cell with the specified ID exists in the notebook.
	 * @param id - The ID of the cell to check.
	 * @returns True if a cell with the specified ID exists, false otherwise.
	 */
	public cellIdExists(id: string) {
		return this.cells.some((c) => c.id === id);
	}

	/**
	 * Checks if a cell has output based on its ID.
	 * @param id - The ID of the cell to check.
	 * @returns True if the cell has output, false otherwise.
	 */
	public cellHasOutput(id: string) {
		const cell = this.getCellById(id);
		if (!cell) {
			return false;
		}
		return cell.outputMessages.length > 0;
	}


	/**
	 * Retrieves the output of a cell with the specified ID.
	 * @param id - The ID of the cell.
	 * @returns The output of the cell.
	 */
	public getOutputMessages(id: string) {
		const cell = this.getCellById(id);
		if (!cell) {
			return null;
		}
		return cell.outputMessages;
	}

	/**
	 * Retrieves the output message associated with the specified id.
	 * @param id - The id of the output cell.
	 * @returns The output message, or null if the output cell is not found.
	 */
	public getOutputMessage(id: string) {
		const output = this.getOutputMessages(id);
		if (!output) {
			return null;
		}
		return output[0];
	}

	/**
	 * Deletes the output cell associated with the specified input cell ID.
	 * @param cellId
	 */
	public clearOutput(cellId: string) {
		const cell = this.getCellById(cellId);
		if (!cell) {
			return;
		}
		cell.outputMessages = [];
	}
	public clearOutputs() {
		this.cells.forEach(c => c.outputMessages = []);
	}


	setInput(message: Message) {
		const cell = this.getCellById(message.id);
		if (!cell) {
			throw new Error(`Cannot find cell with id ${message.id}.`);
		}
		message.isOutput = false;
		cell.inputMessage = message;
		return cell;
	}

	public deleteOutputMessage(messageId: string) {
		const cell = this.getCellById(messageId);
		if (!cell) {
			throw new Error(`Cannot find cell with id ${messageId}.`);
		}
		const index = cell.outputMessages.findIndex(m => m.id === messageId);
		if (index === -1) {
			throw new Error(`Cannot find output message with id ${messageId}.`);
		}
		cell.outputMessages.splice(index, 1);
		return cell;
	}

	public getNextCellId(cellId: string) {
		const currentCell = this.getCellById(cellId);
		if (!currentCell) {
			return null;
		}
		const currentIndex = this.cells.indexOf(currentCell);
		const nextIndex = currentIndex + 1;
		if (nextIndex >= this.cells.length) {
			return null;
		}
		return this.cells[nextIndex].id;
	}


	public getPreviousCellId(cellId: string) {
		const currentCell = this.getCellById(cellId);
		if (!currentCell) {
			return null;
		}
		const currentIndex = this.cells.indexOf(currentCell);
		const previousIndex = currentIndex - 1;
		if (previousIndex < 0) {
			return null;
		}
		return this.cells[previousIndex].id;
	}

	public deleteCell(cellId: string) {
		const cell = this.getCellById(cellId);
		if (!cell) {
			return;
		}
		const index = this.cells.indexOf(cell);
		if (index === -1) {
			return;
		}
		this.cells.splice(index, 1);
	}

	public toJSON() {
		return {
			typeName: this.typeName,
			id: this.id,
			name: this.name,
			description: this.description,
			linear: this.linear,
			cells: this.cells.map(c => c.toJSON()),
		};
	}
	public static fromJson(json: any): Notebook {
		const nb = new Notebook(json.name, json.description, json.id);
		nb.linear = json.linear;
		nb._cells = json.cells.map((c: any) => NotebookCell.fromJson(c, nb));
		return nb;
	}
}
