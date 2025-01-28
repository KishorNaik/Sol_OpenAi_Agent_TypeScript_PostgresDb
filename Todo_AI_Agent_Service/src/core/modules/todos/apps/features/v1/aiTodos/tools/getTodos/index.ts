import Container, { Service } from "typedi";
import { IServiceHandlerAsync, IServiceHandlerNoParamsAsync, IServiceHandlerVoidAsync } from "../../../../../../../../shared/utils/helpers/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError, ResultExceptionFactory } from "../../../../../../../../shared/utils/exceptions/results";
import { AddTodosService, GetTodoService, StatusEnum, ToDoEntity } from "@kishornaik/todo-db-library";
import { StatusCodes } from "http-status-codes";
import { Guid } from "guid-typescript";
import Enumerable from "linq";

Container.set<GetTodoService>(GetTodoService, new GetTodoService());

export interface IGetTodosServiceToolResult{
  identifier:string;
  title:string;
  description:string;
}

export interface IGetTodosServiceTool extends IServiceHandlerNoParamsAsync<IGetTodosServiceToolResult[]>{

}

@Service()
export class GetTodosServiceTool implements IGetTodosServiceTool{

  private readonly _getTodosService:GetTodoService;

  public constructor() {
    this._getTodosService=new GetTodoService();
  }

  public async handleAsync(): Promise<Result<IGetTodosServiceToolResult[], ResultError>> {
    try
    {

      let todoEntity:ToDoEntity=new ToDoEntity();
      todoEntity.status=StatusEnum.ACTIVE;

      const result=await this._getTodosService.handleAsync(
        todoEntity,
        null,
        null,
        null
      );

      if(result.isErr())
        return ResultExceptionFactory.error(result.error.statusCode, result.error.message);

      const todos=await result.value.selectQueryBuilder.getMany();

      var res=Enumerable.from(todos)
                .select<IGetTodosServiceToolResult>((x)=>({
                  identifier:x.identifier!,
                  title:x.title!,
                  description:x.description!
                }))
                .toArray();

      return new Ok(res);

    }
    catch(ex){
      const error=ex as Error;
      return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }

}
