import { Utils } from "@orbifold/utils";
import { TextMessage } from "./TextMessage";

/**
 * Represents an error message.
 */
export class ErrorMessage extends TextMessage {
	public typeName: string = "ErrorMessage";

	constructor(public error: Error | string, id: string = Utils.id()) {
		super((error instanceof Error) ? error.message : error.toString(), id);
	}

	static fromError(error: Error): ErrorMessage {
		return new ErrorMessage(error);
	}

	static fromString(msg: string): ErrorMessage {
		return new ErrorMessage(new Error(msg));
	}
}
