import { Service } from 'typedi';
import { ToDoEntity } from '../../../../infrastructures/entity/todos/index.Entity';
import { DeleteService } from '../../../../../../shared/services/db/delete.Service';

@Service()
export class RemoveTodosService extends DeleteService<ToDoEntity> {
	public constructor() {
		super(ToDoEntity);
	}
}
