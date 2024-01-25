import { Utils } from "@orbifold/utils";
import { Message } from "..";

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
  public w: number = 0;
  public h: number = 0;
  public colSpan: number = 4;
  public hasHighlight: boolean = false;
  /**
   * Gets the id of the notebook cell.
   * This is always the id of the message.
   * @returns The id of the notebook cell.
   */
  public get id(): string {
    return this.message.id;
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
  /**
   * Represents a notebook cell.
   * @param notebook - The notebook object this cell belongs to.
   * @param message - The message object.
   * @param direction - The direction of the cell (input or output). Default is "input".
   * @param inputCellId - The id of the input cell if this is an output cell. Default is null.
   */
  constructor(
    public notebook: any,
    public message: Message,
    public direction = "input",
    public inputCellId: string | null = null
  ) {
    if (direction !== "input" && direction !== "output") {
      throw new Error(
        `Cannot create a notebook cell with direction ${direction}.`
      );
    }
    if (!message) {
      throw new Error("Cannot create a notebook cell without a message.");
    }
    if (notebook) {
      if (direction === "output") {
        const found = this.notebook.getInputCell(this.inputCellId);
        if (!found) {
          throw new Error(
            `Cannot find a reference input cell with id ${this.inputCellId}.`
          );
        }
      }
    }
  }
}
