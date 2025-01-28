import { AddTodosService } from './apps/features/v1/addTodos';
import { GetByIdTodoService } from './apps/features/v1/getByIdTodos';
import { GetTodoService } from './apps/features/v1/getTodos';
import { RemoveTodosService } from './apps/features/v1/removeTodos';
import { UpdateTodosService } from './apps/features/v1/updateTodos';
import { ToDoEntity } from './infrastructures/entity/todos/index.Entity';

// Entity Db Datasource Register
export const todoModuleDbDataSourceEntity: Function[] = [ToDoEntity];

// Export Entity
export { ToDoEntity };

// Export Service
export {
	AddTodosService,
	GetByIdTodoService,
	RemoveTodosService,
	UpdateTodosService,
	GetTodoService,
};
