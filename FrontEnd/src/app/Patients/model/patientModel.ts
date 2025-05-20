export class PatientModel {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        // public fullName: string,
        public medicalRecord: string,
        public emergencyContact: string,
        public gender: string,
        public dateOfBirth: Date,
        public email: string,
        public phone: string,
    ){}
    
}