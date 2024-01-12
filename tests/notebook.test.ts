import { describe, test, it, expect } from "vitest";
import { Message, MessageFactory, TextMessage, Notebook } from "../src";
describe("Notebooks", () => {
  it("should ", () => {
    const nb = new Notebook();
    nb.addCell();
    expect(nb.cells.length).toBe(1);
    expect(nb.cells[0].index).toBe("");
    expect(nb.cells[0].id).not.toBe("");
    expect(nb.cells[0].direction).toBe("input");

    nb.addCell();
    expect(nb.cells.length).toBe(2);
    const firstId = nb.cells[0].id;
    const secondId = nb.cells[1].id;
    let c1 = nb.addCell(null, firstId); //after the first
    let seq = nb.idSequence;
    expect(seq).toEqual([firstId, c1.id, secondId]);
    let c2 = nb.addCell(null, firstId, "before"); //before the first
    seq = nb.idSequence;
    expect(seq).toEqual([c2.id, firstId, c1.id, secondId]);
    let c3 = nb.addCell(null, secondId, "before"); //before the second
    seq = nb.idSequence;
    expect(seq).toEqual([c2.id, firstId, c1.id, c3.id, secondId]);
    
  });
});
