import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { UserRole } from '../utils/enums';
import { RecipientContractDTO } from './RecipientContractDTO';
import { ContractDTO } from './ContractDTO';

export class UserDTO {

    @Expose({ name: '_id' })
    @Type(() => String)
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    role!: UserRole;

    @Expose()
    email!: string;

    @Expose()
    password!: string;

    @Expose()
    @Transform(({ obj }) => {
        return obj.contracts[obj.role].length ? (obj.role == UserRole.PROVIDER ?
            plainToClass(ContractDTO, obj.contracts[obj.role], {
                excludeExtraneousValues: true
            }) :
            plainToClass(RecipientContractDTO, obj.contracts[obj.role], {
                excludeExtraneousValues: true

            })) : undefined
    })
    contracts!: RecipientContractDTO[] | ContractDTO[];

}