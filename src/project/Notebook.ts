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
    cell: NotebookCell|null=null,
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
      const index = this.cells.findIndex((c) => c.id === cellId);
      if (index === -1) {
        throw new Error(`Cannot find a cell with id ${cellId}.`);
      }
      if (beforeOrAfter === "after") {
        this.cells.splice(index + 1, 0, cell);
      } else {
        this.cells.splice(index, 0, cell);
      }
    }
	return cell;
  }
  public get idSequence() {
	return this.cells.map((c) => c.id);
  }
}
