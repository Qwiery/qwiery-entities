import { Message } from "./Message";

/* The stuff that can go in and can come out of the terminal. */
export declare type TerminalIO = string | string[]|Error | Message | Message[];
/** The function the parent component should implement when using the Terminal. */
export declare type ExecutionFunction = (input: TerminalIO) => Promise<TerminalIO>;
export declare type CommandFunction = (input: string) => Promise<TerminalIO>;