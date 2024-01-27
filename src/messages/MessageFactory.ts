import { CommandMessage } from "./CommandMessage";
import { ErrorMessage } from "./ErrorMessage";
import { TextMessage } from "./TextMessage";
import { Message } from "./Message";
import { Utils } from "@orbifold/utils";
import { DataMessage } from "~/messages/DataMessage";
import { DebugMessage } from "~/messages/DebugMessage";
import { ImageMessage } from "~/messages/ImageMessage";
import { MarkdownMessage } from "~/messages/MarkdownMessage";
import { WarningMessage } from "~/messages/WarningMessage";
import { CypherMessage } from "~/messages/CypherMessage";

/**
 * Represents a factory class for creating different types of messages.
 */
export class MessageFactory {
	static fromString(text: string): TextMessage {
		return new TextMessage(text);
	}

	static fromError(error: Error | string): ErrorMessage {
		if (typeof error === "string") {
			return new ErrorMessage(new Error(<string>error));
		}
		if (error instanceof Error) {
			return new ErrorMessage(<Error>error);
		}
		throw new Error("Invalid Error type");
	}

	static fromAny(something: any): Message | Message[] | null {
		if (something instanceof Message) {
			return something;
		}
		if (something instanceof Error) {
			return MessageFactory.fromError(something);
		}
		if (Utils.isSimpleValue(something)) {
			return MessageFactory.fromString(something.toString());
		}
		if (something instanceof Array) {
			if (something.length === 0) {
				return null;
			}
			const firstItem = something[0];
			if (firstItem instanceof Message) {
				return something;
			}
			if (firstItem instanceof Error) {
				return something.map((error: Error) => MessageFactory.fromError(error));
			}
			if (typeof firstItem === "string") {
				return something.map((text: string) => MessageFactory.fromString(text));
			}
		}
		return null;
	}

	static fromCommand(comandName: string, args: string[] = []): CommandMessage {
		return new CommandMessage(comandName, args);
	}

	static fromJson(json: any): Message {
		if (Utils.isEmpty(json)) {
			throw new Error("JSON is empty");
		}
		const mapping = {
			"CodeMessage": CommandMessage,
			"CommandMessage": CommandMessage,
			"CypherMessage": CypherMessage,
			"DataMessage": DataMessage,
			"DebugMessage": DebugMessage,
			"ErrorMessage": ErrorMessage,
			"ImageMessage": ImageMessage,
			"MarkdownMessage": MarkdownMessage,
			"TextMessage": TextMessage,
			"WarningMessage": WarningMessage,
		};
		if (!mapping[json.typeName]) {
			throw new Error(`Cannot find message type ${json.typeName}`);
		}
		return mapping[json.typeName].fromJson(json);
	}
}
