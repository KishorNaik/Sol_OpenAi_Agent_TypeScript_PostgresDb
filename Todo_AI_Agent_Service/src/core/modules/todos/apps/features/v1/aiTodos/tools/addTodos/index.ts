import Container, { Service } from "typedi";
import { IServiceHandlerAsync, IServiceHandlerVoidAsync } from "../../../../../../../../shared/utils/helpers/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError, ResultExceptionFactory } from "../../../../../../../../shared/utils/exceptions/results";
import { AddTodosService, StatusEnum, ToDoEntity } from "@kishornaik/todo-db-library";
import { StatusCodes } from "http-status-codes";
import { Guid } from "guid-typescript";

Container.set<AddTodosService>(AddTodosService, new AddTodosService());

export interface IAddTodosServiceToolParameters{
  title:string;
  description:string;
}

export interface IAddTodosServiceTool extends IServiceHandlerAsync<IAddTodosServiceToolParameters,string>{

}

@Service()
export class AddTodosServiceTool implements IAddTodosServiceTool{

  private readonly _addTodosService:AddTodosService;

  public constructor() {
    this._addTodosService=new AddTodosService();
  }

  public async handleAsync(params: IAddTodosServiceToolParameters): Promise<Result<string, ResultError>> {
    try
    {
      if(!params)
        return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'parameter is null'));

      let todoEntity:ToDoEntity=new ToDoEntity();
      todoEntity.identifier=Guid.create().toString();
      todoEntity.title=params.title
      todoEntity.description=params.description
      todoEntity.status=StatusEnum.ACTIVE;
      todoEntity.created_date=new Date();
      todoEntity.modified_date=new Date();

      const result=await this._addTodosService.handleAsync(todoEntity);
      if(result.isErr())
        return ResultExceptionFactory.error(result.error.statusCode, result.error.message);

      return new Ok(todoEntity.identifier);

    }
    catch(ex){
      const error=ex as Error;
      return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }

}
