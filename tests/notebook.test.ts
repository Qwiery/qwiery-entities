import { describe, test, it, expect } from "vitest";
import {
  Message,
  MessageFactory,
  TextMessage,
  Notebook,
  NotebookCell,
} from "../src";
describe("Notebooks", () => {
  it("should add cells", () => {
    const nb = new Notebook();

    let c0 = nb.addCell();
    expect(c0.index).toEqual(0);
    expect(nb.cells.length).toBe(1);
    expect(nb.cells[0].id).not.toBe("");
    expect(nb.cells[0].direction).toBe("input");

    let c1 = nb.addCell();
    expect(nb.cells.length).toBe(2);
    expect(c1.index).toEqual(1);

    let c2 = nb.addCell(null, c0.id); //after the first
    let seq = nb.idSequence;
    expect(seq).toEqual([c0.id, c2.id, c1.id]);

    let c3 = nb.addCell(null, c0.id, "before"); //before the first
    seq = nb.idSequence;
    expect(seq).toEqual([c3.id, c0.id, c2.id, c1.id]);

    let c4 = nb.addCell(null, c2.id, "before"); //before the second
    seq = nb.idSequence;
    expect(seq).toEqual([c3.id, c0.id, c4.id, c2.id, c1.id]);

    // cannot add an input cell with an inputCellId
    expect(() =>
      nb.addCell(new NotebookCell(nb, new TextMessage("input"), "input", "abc"))
    ).toThrow();

    // cannot add output without existing input
    expect(() =>
      nb.addCell(
        new NotebookCell(nb, new TextMessage("output"), "output", "abc")
      )
    ).toThrow();
    expect(() =>
      nb.addCell(
        new NotebookCell(nb, new TextMessage("output"), "output", null)
      )
    ).toThrow();
    // but can add output with existing input
    let c5 = nb.addCell(
      new NotebookCell(nb, new TextMessage("output"), "output", c0.id)
    );
    seq = nb.idSequence;
    expect(seq).toEqual([c3.id, c0.id, c5.id, c4.id, c2.id, c1.id]);
    // replacing the output
    let out1 = new TextMessage("output 1");
    let c6 = nb.addCell(new NotebookCell(nb, out1, "output", c0.id));
    seq = nb.idSequence;
    expect(seq).toEqual([c3.id, c0.id, c6.id, c4.id, c2.id, c1.id]);
    expect(c4.index).toEqual(3);
    expect(nb.cellHasOutput(c0.id)).toBe(true);
    expect(nb.cellHasOutput(c1.id)).toBe(false);
    const m = nb.getOutputMessage(c0.id);
    expect(m.id).toEqual(out1.id);
    expect(m.text).toEqual(out1.text);
  });

  it("should delete cells", () => {
    const nb = new Notebook();
    const inputMessage = new TextMessage("Some input here " + Math.random());
    const outputMessage = new TextMessage("Some output here " + Math.random());
    let c0 = nb.addInputMessage(inputMessage);
    let c1 = nb.addOutputMessage(outputMessage, c0.id);
    expect(nb.cells.length).toBe(2);

    // delete output but the id does not refer to the input
    nb.deleteOutput(c1.id);
    expect(nb.cells.length).toBe(2);
    // this is correct
    nb.deleteOutput(c0.id);
    expect(nb.cells.length).toBe(1);
    // add output again
    c1 = nb.addOutputMessage(outputMessage, c0.id);
    // delete input deletes both
    nb.deleteInput(c0.id);
    expect(nb.cells.length).toBe(0);
  });
});
