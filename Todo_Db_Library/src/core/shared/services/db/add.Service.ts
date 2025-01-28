import { Err, Ok, Result } from 'neverthrow';
import { ResultError } from '../../utils/exceptions/results';
import Container, { Service } from 'typedi';
import { DataSource, QueryRunner } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { DtoValidation, IDtoValidation } from '../../utils/validations/dto';
import { dbDataSource } from '../../../config/dbSource';

export interface IAddService<TInput, TOutput> {
	handleAsync(
		params: TInput,
		queryRunner?: QueryRunner
	): Promise<Result<TOutput | null, ResultError>>;
}

@Service()
export class AddService<T extends object> implements IAddService<T, T> {
	private readonly db: DataSource;
	private readonly dtoValidation: IDtoValidation<T>;

	public constructor(entity: new () => T) {
		this.db = dbDataSource;
		this.entity = entity;
		this.dtoValidation = Container.get(DtoValidation<T>);
	}

	private entity: new () => T;

	public async handleAsync(
		params: T,
		queryRunner?: QueryRunner
	): Promise<Result<T | null, ResultError>> {
		try {
			if ('identifier' in (params as any) === false)
				return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'Identifier is required'));

			if ('status' in (params as any) === false)
				return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'Status is required'));

			// Validate Entity
			const validationResult = await this.dtoValidation.handleAsync({
				dto: params,
				dtoClass: (params as any).constructor,
			});
			if (validationResult.isErr()) return new Err(validationResult.error);

			// Run Query Runner
			const entityManager = queryRunner ? queryRunner.manager : this.db.manager;

			// Insert Query
			const result = await entityManager
				.createQueryBuilder()
				.insert()
				.into(this.entity)
				.values(params!)
				.execute();

			// Check if insert is successfully
			if (!result.identifiers[0].id)
				return new Err(
					new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to insert entity')
				);

			// Get Entity
			return new Ok(params);
		} catch (ex) {
			const error = ex as Error;
			return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
		}
	}
}
