import { describe, test, it, expect } from "vitest";
import {
	Message,
	MessageFactory,
	TextMessage,
	Notebook,
	NotebookCell, ErrorMessage,
} from "../src";
import { DebugMessage } from "../src/messages/DebugMessage";

describe("Notebooks", () => {
	it("should add cells", () => {
		const nb = new Notebook();

		let c0 = nb.addCell();
		expect(c0.index).toEqual(0);
		expect(nb.cells.length).toBe(1);
		expect(nb.cells[0].id).not.toBe("");

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
			nb.addCell(NotebookCell.empty(nb), "abc"),
		).toThrow();

		// but can add output with existing input
		let c5 = nb.addCell(NotebookCell.empty(nb), c0.id);

		seq = nb.idSequence;
		expect(seq).toEqual([c3.id, c0.id, c5.id, c4.id, c2.id, c1.id]);
		// replacing the output
		let out1 = TextMessage.empty();
		let c6 = nb.addCell(new NotebookCell(nb, out1), c0.id);
		seq = nb.idSequence;
		expect(seq).toEqual([c3.id, c0.id, c6.id, c5.id, c4.id, c2.id, c1.id]);
		expect(c4.index).toEqual(4);
		expect(nb.cellHasOutput(c0.id)).toBe(false);
		let out2 = TextMessage.fromString("abc");
		nb.addOutput(out2, c0.id);
		expect(nb.cellHasOutput(c0.id)).toBe(true);
		const m = nb.getOutputMessage(c0.id);
		expect(m.id).toEqual(out2.id);
		expect(m.text).toEqual(out2.text);
	});

	it("should delete cells", () => {
		const nb = new Notebook();
		const in1 = new TextMessage("Some input here " + Math.random());
		const out2 = new TextMessage("Some output here " + Math.random());
		let c0 = nb.addMessage(in1);
		nb.setOutput(out2, c0.id);
		expect(nb.cells.length).toBe(1);

		nb.clearOutput(c0.id);
		expect(nb.cells.length).toBe(1);
		expect(c0.outputMessages).toHaveLength(0);

		nb.deleteCell(c0.id);
		expect(nb.cells.length).toBe(0);
	});

	it("should navigate input cells", () => {
		const nb = new Notebook();
		const i1 = new TextMessage("Some input here " + Math.random());
		const o1 = new TextMessage("Some output here " + Math.random());
		const i2 = new TextMessage("Some input here " + Math.random());
		const o2 = new TextMessage("Some output here " + Math.random());
		nb.addInputOutput(i1, o1);
		nb.addInputOutput(i2, o2);


		expect(nb.getPreviousCellId("abc")).toBe(null);
		expect(nb.getNextCellId("abc")).toBe(null);
		expect(nb.getPreviousCellId(i1.id)).toBe(null);
		expect(nb.getNextCellId(i1.id)).toBe(i2.id);
		expect(nb.getPreviousCellId(i2.id)).toBe(i1.id);
		expect(nb.getNextCellId(i2.id)).toBe(null);
		expect(nb.getPreviousCellId("abc")).toBe(null);
	});

	it("should serialize notebooks", () => {
		const nb = new Notebook();
		let c = nb.addInputOutput(TextMessage.fromString("abc"), ErrorMessage.fromString("error"));
		c.x = 42
		c.y = 43
		let json = nb.toJSON();//?
		let nbr = Notebook.fromJson(json);//?
		expect(nbr).toBeInstanceOf(Notebook);
		expect(nbr.cells).toHaveLength(1);
		expect(nbr.cells[0].inputMessage).toBeInstanceOf(TextMessage);
		expect(nbr.cells[0].outputMessages[0]).toBeInstanceOf(ErrorMessage);
		expect(nbr.cells[0].x).toEqual(42);
		expect(nbr.cells[0].y).toEqual(43);

	});
});
