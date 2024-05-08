import { Expose, Type } from 'class-transformer';
import { PaymentStatus } from '../utils/enums';
import { ContractDTO } from './ContractDTO';

export class PaymentDTO {
    @Expose({ name: "_id" })
    @Type(() => String)
    id!: string;

    @Expose()
    dueDate!: Date;

    @Expose()
    expectedAmount!: number;

    @Expose()
    outstandingAmount!: number;

    @Expose()
    status!: PaymentStatus;

    @Expose()
    @Type(() => ContractDTO)
    contract!: ContractDTO;

    @Expose()
    @Type(() => String)
    user!: string;
}