import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { contractStatus } from '../utils/enums';
import { PaymentDTO } from './PaymentDTO';
import { CashkickDTO } from './CashkickDTO';
import { Types } from 'mongoose';
import { ContractDTO } from './ContractDTO';

export class RecipientContractDTO {

    @Expose()
    @Transform(({ obj }) => {
        return obj.contractDetail instanceof Types.ObjectId ? obj.contractDetail : plainToClass(ContractDTO, obj.contractDetail, {
            excludeExtraneousValues: true
        })
    })
    @Type(() => ContractDTO)
    contractDetail!: ContractDTO;
    @Expose()
    status!: contractStatus;
    @Expose()
    startDate!: Date;

    @Expose()
    @Transform(({ obj }) => {
        return obj.payments.length ? obj.payments[0] instanceof Types.ObjectId ? obj.payments : plainToClass(PaymentDTO, obj.payments, {
            excludeExtraneousValues: true
        }) : undefined
    })
    @Type(() => PaymentDTO)
    payments!: PaymentDTO[] | string[]

    @Expose()
    @Transform(({ obj }) => {
        return obj.cashkick instanceof Types.ObjectId ? obj.cashkick : plainToClass(CashkickDTO, obj.cashkick, {
            excludeExtraneousValues: true
        })
    })
    cashkick!: CashkickDTO
}