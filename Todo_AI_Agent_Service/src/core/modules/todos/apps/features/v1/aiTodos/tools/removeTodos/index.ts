import Container, { Service } from "typedi";
import { IServiceHandlerVoidAsync } from "../../../../../../../../shared/utils/helpers/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError, ResultExceptionFactory } from "../../../../../../../../shared/utils/exceptions/results";
import { AddTodosService, RemoveTodosService, StatusEnum, ToDoEntity } from "@kishornaik/todo-db-library";
import { StatusCodes } from "http-status-codes";
import { Guid } from "guid-typescript";

Container.set<RemoveTodosService>(RemoveTodosService, new RemoveTodosService());

export interface IRemoveTodosServiceToolParameters{
  identifier:string;
}

export interface IRemoveTodosServiceTool extends IServiceHandlerVoidAsync<IRemoveTodosServiceToolParameters>{

}

@Service()
export class RemoveTodosServiceTool implements IRemoveTodosServiceTool{

  private readonly _removeTodosService:RemoveTodosService;

  public constructor() {
    this._removeTodosService=new RemoveTodosService();
  }

  public async handleAsync(params: IRemoveTodosServiceToolParameters): Promise<Result<undefined, ResultError>> {
    try
    {
      if(!params)
        return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'parameter is null'));

      let todoEntity:ToDoEntity=new ToDoEntity();
      todoEntity.identifier=params.identifier;
      todoEntity.status=StatusEnum.ACTIVE;

      const result=await this._removeTodosService.handleAsync(todoEntity);
      if(result.isErr())
        return ResultExceptionFactory.error(result.error.statusCode, result.error.message);

      return new Ok(undefined);

    }
    catch(ex){
      const error=ex as Error;
      return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }

}
