import { describe, test, it, expect } from "vitest";
import { CodeMessage, Message, MessageFactory, TextMessage } from "../src";
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
    let j = JSON.stringify(m);
    const m2 = TextMessage.fromJson(JSON.parse(j));
    expect(m2).toBeInstanceOf(TextMessage);
    expect(m2.text).toEqual("abc");

    const m3 = MessageFactory.fromJson( ({ typeName: "TextMessage", text: "abc"}));
    expect(m3).toBeInstanceOf(TextMessage);
    expect(m3.text).toEqual("abc");

    const cm = new CodeMessage("abc","K");
    cm.correlationId = Math.random().toString().slice(2);
    j = cm.toJSON();
    const cm2 = CodeMessage.fromJson(j);
    expect(cm2).toBeInstanceOf(CodeMessage);
    expect(cm2.code).toEqual("abc");
    expect(cm2.language).toEqual("K");
    expect(cm2.correlationId).toEqual(cm.correlationId);

  });
});
