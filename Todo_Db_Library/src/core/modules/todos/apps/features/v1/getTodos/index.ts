import { Service } from 'typedi';
import { ToDoEntity } from '../../../../infrastructures/entity/todos/index.Entity';
import { GetService } from '../../../../../../shared/services/db/get.Service';

@Service()
export class GetTodoService extends GetService<ToDoEntity> {
	public constructor() {
		super(ToDoEntity);
	}
}
