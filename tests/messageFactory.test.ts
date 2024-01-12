import { describe, test, it, expect } from "vitest";
import { ErrorMessage, Message, MessageFactory, TextMessage } from "../src";

describe("MessageFactory", () => {
  it("should handle diverse cases", () => {
    expect(MessageFactory.fromAny("Hello")).toBeInstanceOf(TextMessage);
    expect(MessageFactory.fromAny(null)).toBe(null);
    expect(MessageFactory.fromAny(undefined)).toBe(null);
    expect(MessageFactory.fromAny(new Error("Hello"))).toBeInstanceOf(ErrorMessage);
    expect(MessageFactory.fromAny(12)).toBeInstanceOf(TextMessage);
    expect(MessageFactory.fromAny(true)).toBeInstanceOf(TextMessage);
    
  });
});
