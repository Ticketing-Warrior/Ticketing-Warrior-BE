import { EntitySchema } from "typeorm";

export const History = new EntitySchema({
  name: "History",
  tableName: "history",
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
