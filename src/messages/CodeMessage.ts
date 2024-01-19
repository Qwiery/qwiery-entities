import { Utils } from "@orbifold/utils";
import { Message } from "./Message";

/**
 * Represents a piece of code.
 * This message is used, in particular, to send code to the terminal and in notebooks.
 */
export class CodeMessage extends Message {
	public typeName: string = "CodeMessage";
	constructor(public code: string = "", public language: string = "javascript", id: string = Utils.id()) {
		super(id);
	}

	static fromString(code: string, language: string = "javascript"): CodeMessage {
		return new CodeMessage(code, language);
	}

	/**
	 * Creates a CodeMessage instance from a JSON object.
	 * @param json - The JSON object representing the CodeMessage.
	 * @returns A CodeMessage instance.
	 * @throws Error if the JSON is empty.
	 */
	public static fromJson(json: any): CodeMessage {
		if (Utils.isEmpty(json)) {
			throw new Error("JSON is empty");
		}
		const message = new CodeMessage(json.code, json.language);
		message.id = json.id || Utils.id();
		return message;
	}

	/**
	 * Converts the CodeMessage instance to a JSON object.
	 * @returns The JSON object representing the CodeMessage.
	 */
	public toJSON(): any {
		return {
			...super.toJSON(),
			code: this.code,
		};
	}
}
