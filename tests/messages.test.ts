import { describe, test, it, expect } from "vitest";
import { Message, MessageFactory, TextMessage } from "../src";
describe("Messages", () => {
  it("should have an id", () => {
    const m = new Message();
    expect(m.id).toBeDefined();
    const j = JSON.stringify(m);
    const m2 = Message.fromJson(JSON.parse(j));
    expect(m2.id).toEqual(m.id);
  });
  it("should serialize things", () => {
    const m = new TextMessage("abc");
    const j = JSON.stringify(m);
    const m2 = TextMessage.fromJson(JSON.parse(j));
    expect(m2).toBeInstanceOf(TextMessage);
    expect(m2.text).toEqual("abc");

    const m3 = MessageFactory.fromJson( ({ typeName: "TextMessage", text: "abc"}));
    expect(m3).toBeInstanceOf(TextMessage);
    expect(m3.text).toEqual("abc");

  });
});
