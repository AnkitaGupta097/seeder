import { Expose, Type } from 'class-transformer';
import { CashkicksStatus } from '../utils/enums';
import { ContractDTO } from './ContractDTO';

export class CashkickDTO {
    @Expose({ name: "_id" })
    @Type(() => String)
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    status!: CashkicksStatus;

    @Expose()
    totalAmount!: number;

    @Expose()
    totalFinanced!: number;

    @Expose()
    @Type(() => ContractDTO)
    contracts!: ContractDTO[];

    @Expose()
    @Type(() => String)
    user!: string;
}