import { Utils } from "@orbifold/utils";
import { Dataset } from "./Dataset";

/**
 * An exploration is an editable graph.
 */
export   class Exploration {
    public typeName = "Exploration";
    public dataset: Dataset | null = null;
  
    constructor(
      public name: string = "New Exploration",
      public description: string = "",
      public id: string = Utils.id()
    ) {}
  }