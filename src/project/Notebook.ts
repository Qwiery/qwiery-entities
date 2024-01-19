import { Utils } from "@orbifold/utils";
import { NotebookCell } from "./NotebookCell";
import { CodeMessage, Message, TextMessage } from "..";

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
    public id: string = Utils.id()
  ) {}

  /**
   * Ensures tha the cell is positioned correctly with respect to the given reference.
   * @param cell {NotebookCell} The cell to add. If none given a CodeMessage is created.
   * @param referenceCellId {string} The id of the cell before or after which the new cell should be added.
   * @param beforeOrAfter {string} Either "before" or "after". Default is "after".
   */
  public addCell(
    cell: NotebookCell | null = null,
    referenceCellId: string | null = null,
    beforeOrAfter: string = "after"
  ) {
    if (!cell) {
      cell = new NotebookCell(this, new TextMessage(""), "input");
    }
    if (cell.direction === "output") {
      if (!cell.inputCellId) {
        throw new Error(
          "Cannot add an output cell without a reference cell id."
        );
      }
      return this.addOutputCell(cell);
    } else {
      return this.addInputCell(cell, referenceCellId, beforeOrAfter);
    }
  }

  /**
   * Adds an output cell to the notebook.
   * 
   * @param cell - The output cell to be added.
   * @returns The added output cell.
   * @throws Error if the cell is null or undefined.
   * @throws Error if the cell does not have a reference cell id.
   * @throws Error if the given cell is not an output cell.
   * @throws Error if the reference input cell cannot be found.
   * @throws Error if trying to add an output cell after an output cell.
   */
  public addOutputCell(cell: NotebookCell) {
    if (!cell) {
      throw new Error("Cannot add an output cell without a cell.");
    }
    if (!cell.inputCellId) {
      throw new Error("Cannot add an output cell without a reference cell id.");
    }
    const referenceCellId = cell.inputCellId;
    if (cell.direction !== "output") {
      throw new Error("Given cell should be an output.");
    }
    const inputCell = this.getCellById(referenceCellId);
    if (!inputCell) {
      throw new Error(
        `Cannot find a reference input cell with id ${referenceCellId}.`
      );
    }
    if (inputCell.direction !== "input") {
      throw new Error(`Cannot add an output cell after an output cell.`);
    }
    const inputIndex = this.cells.findIndex(
      (c) => c.id === referenceCellId && c.direction === "input"
    );
    // check wether the output is new or replacing an existing one
    // note that we check the reference id here and not the cell id
    // this is because the id of the cell and the message id are identical
    const outputIndex = this.cells.findIndex(
      (c) => c.inputCellId === referenceCellId && c.direction === "output"
    );
    if (outputIndex > -1) {
      this.cells.splice(outputIndex, 1, cell);
    } else {
      this.cells.splice(inputIndex + 1, 0, cell);
    }
    return cell;
  }

  /**
   * Adds an output message to the notebook.
   * 
   * @param message - The message to be added as an output.
   * @param inputCellId - The ID of the input cell associated with the output message.
   * @returns The added output cell.
   */
  public addOutputMessage(message: Message, inputCellId: string) {
    const cell = new NotebookCell(this, message, "output", inputCellId);
    return this.addOutputCell(cell);
  }

  /**
   * Adds an input message to the notebook.
   * 
   * @param message - The message to be added.
   * @param referenceCellId - The ID of the reference cell. Defaults to null.
   * @param beforeOrAfter - Specifies whether to add the cell before or after the reference cell. Defaults to "after".
   * @returns The added input cell.
   */
  public addInputMessage(
    message: Message,
    referenceCellId: string | null = null,
    beforeOrAfter: string = "after"
  ) {
    const cell = new NotebookCell(this, message, "input");
    return this.addInputCell(cell, referenceCellId, beforeOrAfter);
  }
  
  /**
   * Adds a new input cell.
   * @param cell {NotebookCell} The cell to add. If none given a CodeMessage is created.
   * @param referenceCellId {string} The id of the cell before or after which the new cell should be added.
   * @param beforeOrAfter {string} Either "before" or "after". Default is "after".
   */
  public addInputCell(
    cell: NotebookCell | null = null,
    referenceCellId: string | null = null,
    beforeOrAfter: string = "after"
  ) {
    if (!cell) {
      cell = new NotebookCell(this, new TextMessage(""), "input");
    } else {
      if (cell.direction === "output") {
        throw new Error("Cannot add an output cell through this method.");
      }
    }
    if (cell.inputCellId) {
      throw new Error("Cannot add an input cell with an inputCellId.");
    }
    if (Utils.isEmpty(referenceCellId)) {
      this.cells.push(cell);
    } else {
      // the id with the direction forms in a way a primary key
      const inputIndex = this.cells.findIndex(
        (c) => c.id === referenceCellId && c.direction === "input"
      );
      // note that we check the reference id here and not the cell id
      // this is because the id of the cell and the message id are identical
      const outputIndex = this.cells.findIndex(
        (c) => c.inputCellId === referenceCellId && c.direction === "output"
      );

      if (inputIndex === -1 && outputIndex === -1) {
        throw new Error(
          `Cannot find reference cell with id ${referenceCellId}.`
        );
      }
      // after the output if available, but before always means before the input
      if (beforeOrAfter === "after") {
        this.cells.splice(
          (outputIndex > 0 ? outputIndex : inputIndex) + 1,
          0,
          cell
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
  
  /**
   * Retrieves the input cell with the specified ID.
   * @param id - The ID of the input cell.
   * @returns The input cell with the specified ID, or null if not found.
   */
  public getInputCell(id: string) {
    return (
      this.cells.find((c) => c.id === id && c.direction === "input") || null
    );
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
    return this.cells.some((c) => c.inputCellId === id);
  }

  /**
   * Retrieves the output cell with the specified ID.
   * @param id The ID of the input cell.
   * @returns The output cell matching the ID, or null if not found.
   */
  public getOutputCell(id: string) {
    return (
      this.cells.find(
        (c) => c.inputCellId === id && c.direction === "output"
      ) || null
    );
  }
  
  /**
   * Retrieves the output of a cell with the specified ID.
   * @param id - The ID of the cell.
   * @returns The output of the cell.
   */
  public getCellOutput(id: string) {
    return this.getOutputCell(id);
  }

  /**
   * Retrieves the output message associated with the specified id.
   * @param id - The id of the output cell.
   * @returns The output message, or null if the output cell is not found.
   */
  public getOutputMessage(id: string) {
    const foundCell = this.getOutputCell(id);
    if (!foundCell) {
      return null;
    }
    return foundCell.message;
  }

  /**
   * Deletes the output cell associated with the specified input cell ID.
   * @param inputCellId The ID of the input cell.
   */
  public deleteOutput(inputCellId: string) {
    const outputIndex = this.cells.findIndex(
      (c) => c.inputCellId === inputCellId && c.direction === "output"
    );
    if (outputIndex > -1) {
      this.cells.splice(outputIndex, 1);
    }
  }
  
  /**
   * Deletes an input cell from the notebook as well as the output cell if present.
   * @param inputCellId - The ID of the input cell to delete.
   */
  public deleteInput(inputCellId: string) {
    this.deleteOutput(inputCellId);
    const inputIndex = this.cells.findIndex(
      (c) => c.id === inputCellId && c.direction === "input"
    );
    if (inputIndex > -1) {
      this.cells.splice(inputIndex, 1);
    }
  }

  updateCell(message: Message) {
    const cell = this.getCellById(message.id);
    if (!cell) {
      throw new Error(`Cannot find cell with id ${message.id}.`);
    }
    cell.message = message;
  }
}
