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
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
});
