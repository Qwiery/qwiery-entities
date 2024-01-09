import { describe, test, it, expect } from "vitest";
import { Message, MessageFactory,TextMessage } from "../../qwiery-vue-terminal/src/components/models";
describe("Messages", () => {
  it("should have an id", () => {
    const m = new Message();
    expect(m.id).toBeDefined();
    const j = JSON.stringify(m);
    const m2 = Message.fromJson(JSON.parse(j));
    expect(m2.id).toEqual(m.id);
  });
  it("should be easy with the MessageFactory", () => {
    expect(MessageFactory.fromAny("hello")).toBeInstanceOf(TextMessage);
    expect(MessageFactory.fromAny(undefined)).toBeNull();
    expect(MessageFactory.fromAny(null)).toBeNull();

  })
});
