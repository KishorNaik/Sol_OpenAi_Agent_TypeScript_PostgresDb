import { Service } from 'typedi';
import { ToDoEntity } from '../../../../infrastructures/entity/todos/index.Entity';
import { DeleteService } from '../../../../../../shared/services/db/delete.Service';
import { GetByIdService } from '../../../../../../shared/services/db/getById.Service';

@Service()
export class GetByIdTodoService extends GetByIdService<ToDoEntity> {
	public constructor() {
		super(ToDoEntity);
	}
}
