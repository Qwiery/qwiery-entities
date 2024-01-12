import { Utils } from "@orbifold/utils";
import { NotebookCell } from "./NotebookCell";
import { CodeMessage } from "..";

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
   * @param cellId {string} The id of the cell before or after which the new cell should be added.
   * @param beforeOrAfter {string} Either "before" or "after". Default is "after".
   */
  public addCell(
    cell: NotebookCell | null = null,
    cellId: string | null = null,
    beforeOrAfter: string = "after"
  ) {
    if (!cell) {
      cell = new NotebookCell(this, new CodeMessage("Hello"), "input");
    }
    if (Utils.isEmpty(cellId)) {
      // add at the end
      this.cells.push(cell);
    } else {
      // the id with the direction forms in a way a primary key
      const inputIndex = this.cells.findIndex(
        (c) => c.id === cellId && c.direction === "input"
      );
      // note that we check the reference id here and not the cell id
      // this is because the id of the cell and the message id are identical
      const outputIndex = this.cells.findIndex(
        (c) => c.inputCellId === cellId && c.direction === "output"
      );

      if (inputIndex === -1 && outputIndex === -1) {
        throw new Error(`Cannot find a cell with id ${cellId}.`);
      }
      if (cell.direction === "input") {
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
      } else {
        // check wether the output is new or replacing an existing one
        if (beforeOrAfter === "before") {
          throw new Error("Cannot add an output cell before an input cell.");
        }
        if (outputIndex > -1) {
          this.cells.splice(outputIndex, 1, cell);
        } else {
          this.cells.splice(inputIndex + 1, 0, cell);
        }
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
  public cellIdExists(id: string) {
    return this.cells.some((c) => c.id === id);
  }
}
