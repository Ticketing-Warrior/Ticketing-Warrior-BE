import { EntitySchema } from "typeorm";

export const Record = new EntitySchema({
  name: "Record",
  tableName: "record",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    duration: {
      type: Number,
      nullable: false,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
  },
});
