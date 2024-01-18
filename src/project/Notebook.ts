import { Utils } from "@orbifold/utils";
import { NotebookCell } from "./NotebookCell";
import { CodeMessage, Message, TextMessage } from "..";

/**
 * The cells are organized in the correct order.
 */
export class Notebook {
  public typeName = "Notebook";
  public cells: NotebookCell[] = [];

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

  public addOutputMessage(message: Message, inputCellId: string) {
    const cell = new NotebookCell(this, message, "output", inputCellId);
    return this.addOutputCell(cell);
  }
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
  public get idSequence() {
    return this.cells.map((c) => c.id);
  }
  public getCellById(id: string) {
    return this.cells.find((c) => c.id === id) || null;
  }
  public getInputCell(id: string) {
    return (
      this.cells.find((c) => c.id === id && c.direction === "input") || null
    );
  }
  public cellIdExists(id: string) {
    return this.cells.some((c) => c.id === id);
  }
  public cellHasOutput(id: string) {
    return this.cells.some((c) => c.inputCellId === id);
  }
  public getOutputCell(id: string) {
    return (
      this.cells.find(
        (c) => c.inputCellId === id && c.direction === "output"
      ) || null
    );
  }
  public getCellOutput(id: string) {
    return this.getOutputCell(id);
  }

  public getOutputMessage(id: string) {
    const foundCell = this.getOutputCell(id);
    if (!foundCell) {
      return null;
    }
    return foundCell.message;
  }
 
  public deleteOutput(inputCellId: string) {
    const outputIndex = this.cells.findIndex(
      (c) => c.inputCellId === inputCellId && c.direction === "output"
    );
    if (outputIndex > -1) {
      this.cells.splice(outputIndex, 1);
    }
  }
  public deleteInput(inputCellId: string) {
    this.deleteOutput(inputCellId);
    const inputIndex = this.cells.findIndex(
      (c) => c.id === inputCellId && c.direction === "input"
    );
    if (inputIndex > -1) {
      this.cells.splice(inputIndex, 1);
    }
  }
}
