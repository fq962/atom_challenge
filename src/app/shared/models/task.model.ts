export interface TaskResponse {
  data: Task[];
  message: string;
  success: boolean;
  count: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: boolean;
  priority: number;
  created_at: Date;
  userId: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: number;
  userId: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: boolean;
}
