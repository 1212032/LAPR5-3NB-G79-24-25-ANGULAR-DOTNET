import { OperationTypeDto } from "../../OperationTypes/dto/operationTypeDto";
import { PatientDto } from "../../Patients/dto/patientDto";

export interface OperationRequestModel {
    id:number,
    deadLineDate : Date,
    priority : string,
    operationType:OperationTypeDto,
    patient: PatientDto,
    status: string
}
