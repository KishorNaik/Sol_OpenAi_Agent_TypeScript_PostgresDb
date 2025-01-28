import { StatusCodes } from "http-status-codes";
import { Err, Ok, Result } from "neverthrow";
import OpenAI from "openai";
import Container, { Service } from "typedi";
import {AddTodosService,getQueryRunner,initializeDatabase, QueryRunner, StatusEnum, ToDoEntity} from "@kishornaik/todo-db-library";
import { Guid } from "guid-typescript";
import { IServiceHandlerNoParamsVoidAsync } from "../../../../../../shared/utils/helpers/services";
import { ResultError, ResultExceptionFactory } from "../../../../../../shared/utils/exceptions/results";
import { AddTodosServiceTool } from "./tools/addTodos";
import { SearchTodosServiceTool } from "./tools/searchTodos";
import { UpdateTodosServiceTool } from "./tools/updateTodos";
import { RemoveTodosServiceTool } from "./tools/removeTodos";
import { GetTodosServiceTool } from "./tools/getTodos";
import { SYSTEM_PROMPT } from "./promts";
import readLineSync from 'readline-sync';

export interface IMessages{
  role:string,
  content:string
}

export interface IRunTodoAiAgent extends IServiceHandlerNoParamsVoidAsync {

}

@Service()
export class RunTodoAiAgent implements IRunTodoAiAgent{



  public constructor() {

  }

  public async handleAsync(): Promise<Result<undefined, ResultError>> {
    try
    {
      // initialize OpenAi Client
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const addTodos=async (title:string, description:string)=>{
        const result= await Container.get(AddTodosServiceTool).handleAsync({
          title,
          description
        });
        if(result.isErr()){
          console.log(result.error.message);
          return;
        }
        return result.value;
      }

      const getTodos=async ()=>{
        const result=await Container.get(GetTodosServiceTool).handleAsync();
        if(result.isErr()){
          console.log(result.error.message);
          return;
        }
        return result.value;
      }

      const searchTodos=async (title:string)=>{
        const result=await Container.get(SearchTodosServiceTool).handleAsync({
          title
        });
        if(result.isErr()){
          console.log(result.error.message);
          return;
        }
        return result.value;
      }

      const updateTodos=async (identifier:string, title:string, description:string)=>{
        await Container.get(UpdateTodosServiceTool).handleAsync({
          identifier,
          title,
          description
        });
      }

      const removeTodos=async (identifier:string)=>{
        await Container.get(RemoveTodosServiceTool).handleAsync({
         identifier
        });
      }

      const tools={
        "addTodos":addTodos,
        "getTodos":getTodos,
        "searchTodos":searchTodos,
        "updateTodos":updateTodos,
        "removeTodos":removeTodos
      }

      const messages:IMessages[]=[
        {
          role:"system",
          content:SYSTEM_PROMPT
        }
      ];

      while(true){
        // Get the Question from the user
        const userQuestionQuery=readLineSync.question('User: ');

        // map user  query to query object
        const query={
          type:"user",
          user:userQuestionQuery
        }

        // push the query to messages array
        messages.push({
          role:"user",
          content:JSON.stringify(query)
        });

        // call openai api
        while(true){
          const chat=await client.chat.completions.create({
            model: 'gpt-4o',
            messages:messages as any,
            response_format:{
              type:"json_object"
            }
          });

          const result=chat.choices[0].message.content;

          messages.push({
            role:"assistant",
            content:result!
          });

          console.log(`\n\n----------------------START AI-----------------------`);
          console.log(`Result:${result}`);
          console.log(`----------------------END AI-----------------------\n\n`);

          const call=JSON.parse(result!);
          if(call.type==='output'){
            console.log(`Assistant: ${call.output}`);
            break;
          }
          else if(call.type==='action'){
            const functionCall = tools[call.function as keyof typeof tools];
            if(!functionCall){
              console.log(`Assistant: I don't know how to do that.`);
              break;
            }
            const observation = await functionCall(call.input.identifier, call.input.title, call.input.description);

            const observationQuery = {
              type: 'observation',
              observation,
            };

            messages.push({
              role: 'developer',
              content: JSON.stringify(observationQuery),
            });
          }
        }

      }
    }
    catch(ex){
      const error=ex as Error;
      return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }

}

