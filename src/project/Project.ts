import { GraphLike, Utils } from "@orbifold/utils";
import _ from "lodash";
import { Exploration } from "./Exploration";
import { Dataset } from "./Dataset";
import { Perspective } from "./Perspective";

/**
 * A Qwiery project is a collection of explorations, perspectives, and more.
 */
export class Project {
	public typeName = "Project";
	public explorations: Exploration[] = [];
	public perspectives: Perspective[] = [];
	public datasets: Dataset[] = [];

	constructor(public name: string = "New Project", public description: string = "", public id: string = Utils.id()) {
	}
}
 
