import Container, { Service } from "typedi";
import { IServiceHandlerAsync, IServiceHandlerVoidAsync } from "../../../../../../../../shared/utils/helpers/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError, ResultExceptionFactory } from "../../../../../../../../shared/utils/exceptions/results";
import { AddTodosService, GetTodoService, StatusEnum, ToDoEntity } from "@kishornaik/todo-db-library";
import { StatusCodes } from "http-status-codes";
import { Guid } from "guid-typescript";
import Enumerable from "linq";

Container.set<GetTodoService>(GetTodoService, new GetTodoService());

export interface ISearchTodosServiceToolParameters{
  title:string;
}

export interface ISearchTodosServiceToolResult{
  identifier:string;
  title:string;
  description:string;
}

export interface ISearchTodosServiceTool extends IServiceHandlerAsync<ISearchTodosServiceToolParameters,ISearchTodosServiceToolResult[]>{

}

@Service()
export class SearchTodosServiceTool implements ISearchTodosServiceTool{

  private readonly _searchTodosService:GetTodoService;

  public constructor() {
    this._searchTodosService=new GetTodoService();
  }

  public async handleAsync(params: ISearchTodosServiceToolParameters): Promise<Result<ISearchTodosServiceToolResult[], ResultError>> {
    try
    {
      if(!params)
        return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'parameter is null'));

      let todoEntity:ToDoEntity=new ToDoEntity();
      todoEntity.status=StatusEnum.ACTIVE;

      const result=await this._searchTodosService.handleAsync(
        todoEntity,
        null,
        (q)=>{
          q.where('title ILIKE :title', { title: `%${params.title}%` });
          return q;
        },
        null
      );

      if(result.isErr())
        return ResultExceptionFactory.error(result.error.statusCode, result.error.message);

      const todos=await result.value.selectQueryBuilder.getMany();

      var res=Enumerable.from(todos)
                .select<ISearchTodosServiceToolResult>((x)=>({
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
