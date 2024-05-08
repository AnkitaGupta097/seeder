import { Expose, Type } from 'class-transformer';
import { contractType } from '../utils/enums';

export class ContractDTO {
    @Expose({ name: "_id" })
    @Type(() => String)
    id!: string;
    @Expose()
    name!: string;
    @Expose()
    type!: contractType;
    @Expose()
    termLength!: number;
    @Expose()
    termRate!: number;
    @Expose()
    perPayment!: number;
    @Expose()
    totalAmount!: number;
    @Expose()
    totalFinanced!: number;
}