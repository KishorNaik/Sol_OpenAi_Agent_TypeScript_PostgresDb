import Container, { Service } from "typedi";
import { IServiceHandlerVoidAsync } from "../../../../../../../../shared/utils/helpers/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError, ResultExceptionFactory } from "../../../../../../../../shared/utils/exceptions/results";
import { AddTodosService, StatusEnum, ToDoEntity, UpdateTodosService } from "@kishornaik/todo-db-library";
import { StatusCodes } from "http-status-codes";
import { Guid } from "guid-typescript";

Container.set<UpdateTodosService>(UpdateTodosService, new UpdateTodosService());

export interface IUpdateTodosServiceToolParameters{
  identifier:string;
  title:string;
  description:string;
}

export interface IUpdateTodosServiceTool extends IServiceHandlerVoidAsync<IUpdateTodosServiceToolParameters>{

}

@Service()
export class UpdateTodosServiceTool implements IUpdateTodosServiceTool{

  private readonly _updateTodosService:UpdateTodosService;

  public constructor() {
    this._updateTodosService=new UpdateTodosService();
  }

  public async handleAsync(params: IUpdateTodosServiceToolParameters): Promise<Result<undefined, ResultError>> {
    try
    {
      if(!params)
        return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'parameter is null'));

      let todoEntity:ToDoEntity=new ToDoEntity();
      todoEntity.identifier=params.identifier;
      todoEntity.title=params.title
      todoEntity.description=params.description
      todoEntity.status=StatusEnum.ACTIVE;
      todoEntity.created_date=new Date();
      todoEntity.modified_date=new Date();

      const result=await this._updateTodosService.handleAsync(todoEntity);
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
