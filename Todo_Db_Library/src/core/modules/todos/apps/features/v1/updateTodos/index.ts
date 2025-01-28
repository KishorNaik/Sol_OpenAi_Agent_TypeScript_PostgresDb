import { Service } from 'typedi';
import { UpdateService } from '../../../../../../shared/services/db/update.Service';
import { ToDoEntity } from '../../../../infrastructures/entity/todos/index.Entity';

@Service()
export class UpdateTodosService extends UpdateService<ToDoEntity> {
	public constructor() {
		super(ToDoEntity);
	}
}
