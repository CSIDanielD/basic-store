import { TaskStatus } from "./taskStatus";

export interface UserTask {
  userId: number;
  taskId: number;
  description?: string;
  taskStatus?: TaskStatus;
}
