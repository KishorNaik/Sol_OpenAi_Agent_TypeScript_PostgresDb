import test, { afterEach, beforeEach, describe } from 'node:test';
import expect from 'expect';
import {
	destroyDatabase,
	getQueryRunner,
	initializeDatabase,
	QueryRunner,
} from '../../../../config/dbSource';
import { ToDoEntity } from '../../infrastructures/entity/todos/index.Entity';
import { faker } from '@faker-js/faker';
import { StatusEnum } from '../../../../shared/models/enums/status.enum';
import { v4 as uuidv4 } from 'uuid';
import { GetTodoService } from '../../apps/features/v1/getTodos';
import { QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { Order } from '../../../../shared/services/db/get.Service';
import {
	getPropertyNameByObject,
	getPropertyNameByType,
} from '../../../../shared/utils/miscellaneous/getPropertyName';

// Debug Mode:All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts

// Debug Mode:Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts

describe(`get_todos`, () => {
	let queryRunner: QueryRunner;
	beforeEach(async () => {
		await initializeDatabase();
		queryRunner = getQueryRunner();
	});

	afterEach(async () => {
		await queryRunner.release();
		await destroyDatabase();
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_false_when_status_is_not_provided' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts
	test(`should_return_false_when_status_is_not_provided`, async () => {
		const todoEntity: ToDoEntity = new ToDoEntity();
		todoEntity.identifier = uuidv4().trim().toString();
		//todoEntity.title=faker.lorem.sentence();
		//todoEntity.description=faker.lorem.sentence();
		//todoEntity.status=StatusEnum.ACTIVE;
		//todoEntity.created_date=new Date();
		//todoEntity.modified_date=new Date();

		await queryRunner.startTransaction();

		const result = await new GetTodoService().handleAsync(
			todoEntity,
			{
				pageNumber: 1,
				pageSize: 10,
			},
			null,
			null,
			queryRunner
		);
		if (result.isErr()) {
			await queryRunner.rollbackTransaction();
			expect(result.isErr()).toBe(true);
			return;
		}

		await queryRunner.commitTransaction();
		expect(true).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_true_when_data_found' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts
	test(`should_return_true_when_data_found`, async () => {
		const todoEntity: ToDoEntity = new ToDoEntity();
		//todoEntity.identifier="";
		//todoEntity.title=""
		//todoEntity.description=""
		todoEntity.status = StatusEnum.ACTIVE;
		//todoEntity.created_date=new Date();
		//todoEntity.modified_date=new Date();

		await queryRunner.startTransaction();

		const result = await new GetTodoService().handleAsync(
			todoEntity,
			null,
			null,
			null,
			queryRunner
		);
		if (result.isErr()) {
			await queryRunner.rollbackTransaction();
			expect(result.isErr()).toBe(true);
			return;
		}

		const res = await result.value.selectQueryBuilder.getMany();

		console.table(res);

		await queryRunner.commitTransaction();
		expect(true).toBe(true);
		expect(res.length).toStrictEqual(2);
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_true_when_data_found_with_pagination' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts
	test(`should_return_true_when_data_found_with_pagination`, async () => {
		const todoEntity: ToDoEntity = new ToDoEntity();
		//todoEntity.identifier="";
		//todoEntity.title=""
		//todoEntity.description=""
		todoEntity.status = StatusEnum.ACTIVE;
		//todoEntity.created_date=new Date();
		//todoEntity.modified_date=new Date();

		await queryRunner.startTransaction();

		const result = await new GetTodoService().handleAsync(
			todoEntity,
			{
				pageNumber: 1,
				pageSize: 1,
			},
			null,
			null,
			queryRunner
		);
		if (result.isErr()) {
			await queryRunner.rollbackTransaction();
			expect(result.isErr()).toBe(true);
			return;
		}

		const res = await result.value.selectQueryBuilder.getMany();

		console.table(res);

		await queryRunner.commitTransaction();
		expect(true).toBe(true);
		expect(res.length).toStrictEqual(1);
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_true_when_data_found_with_addWhereClause' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts
	test(`should_return_true_when_data_found_with_addWhereClause`, async () => {
		const todoEntity: ToDoEntity = new ToDoEntity();
		//todoEntity.identifier="";
		//todoEntity.title=""
		//todoEntity.description=""
		todoEntity.status = StatusEnum.ACTIVE;
		//todoEntity.created_date=new Date();
		//todoEntity.modified_date=new Date();

		await queryRunner.startTransaction();

		const result = await new GetTodoService().handleAsync(
			todoEntity,
			null,
			(queryBuilder: SelectQueryBuilder<ToDoEntity>) => {
				return queryBuilder.andWhere('entity.title ILIKE :title', { title: '%Magni%' });
			},
			null,
			queryRunner
		);
		if (result.isErr()) {
			await queryRunner.rollbackTransaction();
			expect(result.isErr()).toBe(true);
			return;
		}

		const res = await result.value.selectQueryBuilder.getMany();

		console.table(res);

		await queryRunner.commitTransaction();
		expect(true).toBe(true);
		expect(res.length).toStrictEqual(1);
	});

	//node --trace-deprecation --test --test-name-pattern='should_return_true_when_data_found_with_orderby' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/todos/tests/getTodos/index.test.ts
	test(`should_return_true_when_data_found_with_orderby`, async () => {
		const todoEntity: ToDoEntity = new ToDoEntity();
		//todoEntity.identifier="";
		//todoEntity.title=""
		//todoEntity.description=""
		todoEntity.status = StatusEnum.ACTIVE;
		//todoEntity.created_date=new Date();
		//todoEntity.modified_date=new Date();

		await queryRunner.startTransaction();

		//const createdDatePropsName=getPropertyNameByType<ToDoEntity>(`created_date`);
		//const modifiedDatePropsName=getPropertyNameByType<ToDoEntity>(`modified_date`);
		// Or
		const createdDatePropsName = getPropertyNameByObject<ToDoEntity>(
			todoEntity,
			`created_date`
		);
		const modifiedDatePropsName = getPropertyNameByObject<ToDoEntity>(
			todoEntity,
			`modified_date`
		);

		const result = await new GetTodoService().handleAsync(
			todoEntity,
			null,
			null,
			{
				by: [createdDatePropsName, modifiedDatePropsName],
				direction: Order.ASC,
			},
			queryRunner
		);
		if (result.isErr()) {
			await queryRunner.rollbackTransaction();
			expect(result.isErr()).toBe(true);
			return;
		}

		const res = await result.value.selectQueryBuilder.getMany();

		console.table(res);

		await queryRunner.commitTransaction();
		expect(true).toBe(true);
		expect(res.length).toStrictEqual(2);
	});
});
