import 'reflect-metadata';
import {AddTodosService, destroyDatabase,initializeDatabase} from "@kishornaik/todo-db-library";
import { RunTodoAiAgent } from './modules/todos/apps/features/v1/aiTodos';
//import { RunTodoAiAgent } from './modules/todos/apps/features/v1/aiTodos';
export * as add from './demo';

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`DB Host: ${process.env.DB_HOST}`);

const main=async ()=>{
  try{
    await initializeDatabase();
    const runTodoAiAgent:RunTodoAiAgent=new RunTodoAiAgent();
    await runTodoAiAgent.handleAsync();
  }
  catch(ex){
    console.log(ex);
  }
  finally
  {
    await destroyDatabase();
  }

};

main().then(()=>{
  console.log('done');
}).catch((ex)=>{
  console.log('error',ex);
});
