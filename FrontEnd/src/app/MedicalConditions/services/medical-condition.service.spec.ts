import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreatingMedicalConditionDto } from '../dto/creatingMedicalConditionDto';
import { MedicalConditionDto } from '../dto/medicalConditionDto';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { MedicalConditionService } from './medical-condition.service';

describe('MedicalConditionService', () => {
  let service: MedicalConditionService;
  let httpMock: HttpTestingController;

  const mockBaseUrl = environment.backend2Url + 'medicalConditions';
  const mockMedicalCondition: MedicalConditionDto = {
    id: '1',
    code: 'C123',
    name: 'Condition A',
    description: 'Test description',
    symptoms: ['Symptom 1'],
  };

  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalConditionService],
    });
    service = TestBed.inject(MedicalConditionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update medical condition', () => {
    service.updateMedicalCondition(mockMedicalCondition).subscribe((response) => {
      expect(response).toEqual(mockMedicalCondition);
    });
  
    const req = httpMock.expectOne(mockBaseUrl + '/'+mockMedicalCondition.id);
    expect(req.request.method).toBe('PUT');  // Expect PUT for update
    req.flush(mockMedicalCondition);
  });

  
});